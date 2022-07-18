import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../redux/post/actions";
import { REMOVE_DATA } from "../../redux/transfer/types";
import { server_url } from "../../config";
import "./CreatePost.css";
function CreatePost() {
  const [post, setPost] = useState("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  const posts = useSelector((state) => state.post.posts);
  const edit_id = useSelector((state) => state.transfer.post_id);
  const delete_id = useSelector((state) => state.transfer.delete_id);
  const navigate = useNavigate();
  var edit_post;
  var delete_post;
  if (edit_id) {
    edit_post = posts.find((post) => post._id == edit_id);
  } else if (delete_id) {
    delete_post = posts.find((post) => post._id == delete_id);
  }
  useEffect(() => {
    if (edit_post) {
      setPost(edit_post.text);
      setImage(edit_post.file);
    } else {
      setPost("");
      setImage("");
    }
  }, [edit_post]);

  const createPost = async (e) => {
    e.preventDefault();

    dispatch({
      type: REMOVE_DATA,
    });
    if (!auth) {
      return;
    }

    const formData = new FormData();
    formData.append("text", post);
    formData.append("user_id", auth.user._id);
    formData.append("file", file);
    var res;
    if (edit_post) {
      console.log(Date.now());
      res = await axios.post(
        `${server_url}/api/edit-post/` + edit_id,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({
        type: REMOVE_DATA,
      });
    } else {
      await axios.post(`${server_url}/api/create-post`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        type: REMOVE_DATA,
      });
    }
    console.log("leee");

    await dispatch(getPosts());
    navigate("/");
    setFile("");
    setImage("");
    setPost("");
  };
  return (
    <div className="container-fluid mx-auto mt-5" style={{ width: "600px" }}>
      <form className="sign-up  mx-auto  p-4" onSubmit={(e) => createPost(e)}>
        <img
          src="/rsz_logosample_bytailorbrands-removebg-preview-removebg-preview.png"
          width="30%"
          className="d-block mx-auto mb-4"
        />
        <h2 className="text-center text-danger fw-bold mb-3">
          {edit_id ? "EDIT POST" : delete_id ? "CONFIRM DELETE" : "CREATE POST"}
        </h2>

        <TextareaAutosize
          className="text-field p-3 fw-bold"
          placeholder={
            auth?.user
              ? "What on your mind, " + auth.user.name + " ?"
              : "What on your mind ?"
          }
          onChange={(e) => setPost(e.target.value)}
          value={post}
          autoFocus
        />
        <div className="my-3">
          <label
            className="btn  btn-sm post-btn fw-bold fs-6 mt-3 fw-bold"
            htmlFor="upload-img-one"
          >
            Upload <i className="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            className="d-none"
            id="upload-img-one"
            onChange={(e) => {
              setImage(URL.createObjectURL(e.target.files[0]));
              setFile(e.target.files[0]);
            }}
          />
          <img
            className={
              image
                ? "d-block mt-3 img-fluid border border-danger border-2 rounded"
                : "d-none"
            }
            src={image}
            width={"200px"}
            height={"200px"}
          />
        </div>

        <div className=" row">
          <button className="btn fw-bold me-3 " disabled={loading}>
            {" "}
            {loading && (
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {edit_post ? "Update" : "Post"}
          </button>
          <Link to="/" className="btn text-light fw-bold mt-2 me-3">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
