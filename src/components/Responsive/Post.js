import React, { useEffect, useState } from "react";
import "../POST/Post.css";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../redux/post/actions";
import { REMOVE_DATA } from "../../redux/transfer/types";
import { server_url } from "../../config";

function Post() {
  const [post, setPost] = useState("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  const posts = useSelector((state) => state.post.posts);
  const edit_id = useSelector((state) => state.transfer.post_id);
  const delete_id = useSelector((state) => state.transfer.delete_id);
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

  const deletePost = async () => {
    if (!auth) {
      return;
    }
    await axios.delete(`${server_url}/api/delete-post/` + delete_id, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        AccessControlAllowOrigin: "*",
        "Content-Type": "application/json",
      },
    });
    dispatch({
      type: REMOVE_DATA,
    });
    dispatch(getPosts());
  };
  const createPost = async () => {
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
      res = await axios.post(`${server_url}/api/create-post`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }
    dispatch(getPosts());
    console.log(res.data);

    setFile("");
    setImage("");
    setPost("");
  };

  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdroptwo"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdroptwoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content ">
            <div className="modal-header">
              <h2
                className="modal-title text-danger fw-bold "
                id="staticBackdroptwoLabel"
              >
                {edit_id
                  ? "EDIT POST"
                  : delete_id
                  ? "CONFIRM DELETE"
                  : "CREATE POST"}
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <form
              className="row  py-0"
              style={{ paddingLeft: ".8rem", paddingRight: ".8rem" }}
            >
              {delete_id ? (
                <>
                  <p className="card-text mt-3 text-light">
                    Are you sure you want to{" "}
                    <span className="text-danger fw-bold">delete</span> this
                    Post?
                  </p>
                  <p className="fw-bold text-light">{delete_post.text}</p>
                  <img
                    className={delete_post.file ? "" : "d-none"}
                    src={delete_post.file}
                    width={"300px"}
                    height={"300px"}
                  />
                </>
              ) : (
                <>
                  {" "}
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
                  <div>
                    <label
                      className="btn  btn-sm post-btn fw-bold fs-6 mt-3 fw-bold"
                      htmlFor="upload-img"
                    >
                      Upload <i className="fa-solid fa-upload"></i>
                    </label>
                    <input
                      type="file"
                      className="d-none"
                      id="upload-img"
                      onChange={(e) => {
                        setImage(URL.createObjectURL(e.target.files[0]));
                        setFile(e.target.files[0]);
                      }}
                    />
                    <img
                      className={
                        image
                          ? "d-block mt-3 img-fluid  border border-danger border-2 rounded"
                          : "d-none"
                      }
                      src={image}
                      width={"200px"}
                      height={"200px"}
                    />
                  </div>
                </>
              )}
            </form>

            {delete_id ? (
              <div className="p-4 ">
                <button
                  className="btn btn-sm post-btn btn-delete fw-bold fs-6  fw-bold"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => deletePost()}
                  style={{ backgroundColor: "transparent" }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-delete-cancel fw-bold me-4"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch({
                      type: REMOVE_DATA,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="p-4 row ">
                <button
                  className="btn btn-sm post-btn fw-bold fs-5  fw-bold"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  disabled={!post}
                  onClick={() => createPost()}
                >
                  {edit_post ? "Update" : "Post"}
                </button>
                <button
                  className="btn text-light fw-bold me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch({
                      type: REMOVE_DATA,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
