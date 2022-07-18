import React, { useEffect, useState } from "react";
import "./DeletePost.css";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../redux/post/actions";
import { REMOVE_DATA } from "../../redux/transfer/types";
import { server_url } from "../../config";

function DeletePost() {
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

  return (
    <div>
      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-danger fw-bold"
                id="staticBackdropLabel"
              >
                CONFIRM DELETE
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            {delete_post && (
              <form
                className="row  py-0"
                style={{ paddingLeft: ".8rem", paddingRight: ".8rem" }}
              >
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
              </form>
            )}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePost;
