import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../POST/Post";
import moment from "moment";
import "./PageLoading.css";
import "./Home.css";

import {
  REMOVE_DATA,
  TRANS_DELETE_ID,
  TRANS_POST_ID,
  TRANS_USER_DATA,
} from "../../redux/transfer/types";
import axios from "axios";
import { getPosts, getPostsOnly } from "../../redux/post/actions";
import { LIKE_PENDING } from "../../redux/post/types";
import Comment from "../Comments/Comment";
import { server_url } from "../../config";
import DeletePost from "../DeletePost/DeletePost";
import { useNavigate } from "react-router-dom";

function Home() {
  const [active, setActive] = useState("");
  const [click, setClick] = useState(false);
  const [comment, setComment] = useState("");
  const [createLoading, setCreateLoading] = useState("");
  const auth = useSelector((state) => state.auth.auth);
  var posts = useSelector((state) => state.post.posts);
  var postLoading = useSelector((state) => state.post);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(posts);

  const trans_ID = (id) => {
    dispatch({
      type: REMOVE_DATA,
    });
    dispatch({
      type: TRANS_POST_ID,
      payload: id,
    });
  };

  const trans_DELETE_ID = (id) => {
    dispatch({
      type: REMOVE_DATA,
    });
    dispatch({
      type: TRANS_DELETE_ID,
      payload: id,
    });
  };

  const likePost = async (id) => {
    if (click) {
      return;
    }
    setClick(true);
    var post = posts.find((post) => post._id == id);
    const isLike = post.like.find((id) => id == String(auth.user._id));
    var newPost;
    if (isLike) {
      newPost = {
        ...post,
        like: post.like.filter((id) => id !== String(auth.user._id)),
      };

      posts = posts.map((post) => (post._id == id ? (post = newPost) : post));
      dispatch({
        type: LIKE_PENDING,
        payload: posts,
      });
    } else {
      newPost = {
        ...post,
        like: [...post.like, auth.user._id],
      };

      posts = posts.map((post) => (post._id === id ? (post = newPost) : post));
      dispatch({
        type: LIKE_PENDING,
        payload: posts,
      });
    }
    const formData = new FormData();
    formData.append("user_id", auth.user._id);
    const res = await axios.get(`${server_url}/api/like-post/` + id, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    await dispatch(getPostsOnly());

    setTimeout(() => {
      setClick(false);
    }, 100);
  };

  const commentPost = async (id) => {
    setCreateLoading(id);
    if (createLoading) {
      return;
    }
    const formData = new FormData();
    formData.append("user_id", auth.user._id);
    formData.append("post_id", id);
    formData.append("comment", comment);
    setComment("");
    const res = await axios.post(
      `${server_url}/api/comment-post/` + id,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    await dispatch(getPostsOnly());
    setCreateLoading("");
    console.log(res.data);
  };

  return (
    <div className="main">
      {postLoading.loading && (
        <div className="mx-auto loading-group">
          <h1 className="page-loading fw-bold col-md-none col-lg-block">
            <span className="let1">l</span>
            <span className="let2">o</span>
            <span className="let3">a</span>
            <span className="let4">d</span>
            <span className="let5">i</span>
            <span className="let6">n</span>
            <span className="let7">g</span>
            <span className="let8">.</span>
            <span className="let9">.</span>
            <span className="let10">.</span>
          </h1>
        </div>
      )}

      <div
        className="container-fluid"
        style={postLoading.loading ? { filter: "blur(10px)" } : {}}
      >
        <div className="row ">
          <div className="col-md-3 mt-1 d-none d-md-none d-lg-block">
            <div className="side-menu p-0">
              <ul className="p-0">
                <li
                  className={
                    active == "home"
                      ? "py-2 px-5 border-start border-danger border-5 "
                      : "py-2 px-5 "
                  }
                >
                  <Link
                    to="/"
                    className={active == "home" ? "text-danger" : ""}
                    onClick={() => setActive("home")}
                  >
                    HOME
                  </Link>
                </li>
                <li
                  className={
                    active == "blogs"
                      ? "py-2 px-5 border-start border-danger border-5 "
                      : "py-2 px-5 "
                  }
                >
                  <a
                    href="#"
                    className={active == "blogs" ? "text-danger" : ""}
                    onClick={() => setActive("blogs")}
                  >
                    BLOGS
                  </a>
                </li>
                <li
                  className={
                    active == "new_feed"
                      ? "py-2 px-5 border-start border-danger border-5 "
                      : "py-2 px-5 "
                  }
                >
                  <Link
                    to="/post-action"
                    href="#"
                    className={active == "new_feed" ? "text-danger" : ""}
                    onClick={() => {
                      dispatch({
                        type: REMOVE_DATA,
                      });
                      setActive("new_feed");
                    }}
                  >
                    ADD POST
                  </Link>
                </li>
              </ul>
            </div>
            <div className="side-menu p-3 text-light fw-bold card">
              <div className="card-body">
                <h5>About This Site</h5>
                <ul>
                  <li>
                    <legend>Features</legend>
                    <ul>
                      <li>Can Create Account with gmail</li>
                      <li>Create Post</li>
                      <li>Comment Post</li>
                      <li>Like Post</li>
                      <li>Like Comments</li>
                      <li>Reply Comments</li>
                    </ul>
                    <p>
                      And we will add more features and fix more about
                      responsive for good user experiences{" "}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                Join our discord channel to collaborator our project. &nbsp;
                <a href="https://www.facebook.com/">Discord</a>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-lg-8 mx-auto main_field">
            {posts.map((post) => (
              <div
                className="new_feed p-2"
                style={{ minWidth: "350px" }}
                key={post._id}
              >
                <div className="card mx-auto my-3">
                  <div className="card_header px-2 py-3 d-flex">
                    <img src={post.user.profile} style={{ height: "50px" }} />
                    <h5 className="ms-2">
                      <Link
                        style={{ color: "whitesmoke", textDecoration: "none" }}
                        to="/user"
                        onClick={() => {
                          dispatch({
                            type: TRANS_USER_DATA,
                            payload: post.user,
                          });
                        }}
                      >
                        {post.user.name}
                      </Link>{" "}
                      <br />{" "}
                      <small className="fs-6">
                        {moment(post.create_At).fromNow()}
                      </small>
                    </h5>
                    {auth.user?._id == post.user._id && (
                      <>
                        <button
                          className="btn ms-auto me-3  "
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa-solid fa-ellipsis fs-4"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <Link
                              to="/post-action"
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                trans_ID(post._id);
                              }}
                            >
                              Edit
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item delete_post"
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop"
                              onClick={() => {
                                trans_DELETE_ID(post._id);
                              }}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>

                  <img
                    src={post.file}
                    className={
                      post.file ? "card-img-top img-fluid p-1" : "d-none"
                    }
                  />
                  <div className="card-body">
                    <p className="card-text fw-bold">{post.text}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-around ">
                    <a
                      className="like btn fs-6 me-auto"
                      onClick={() =>
                        auth?.user ? likePost(post._id) : navigate("/auth")
                      }
                    >
                      <i
                        className="fa-solid fa-thumbs-up"
                        style={
                          post.like.find((id) => id == auth.user?._id)
                            ? { color: "#DC3545" }
                            : { color: "#212529" }
                        }
                      ></i>

                      <span className="ms-2">{post.like.length}</span>
                    </a>
                    <a
                      role="button"
                      className="comments mt-2 fw-bold"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                      href={`#collapse_${post._id}`}
                    >
                      <span className="me-2 ">{post.comments?.length}</span>
                      Comments
                    </a>
                  </div>

                  <div className="collapse" id={`collapse_${post._id}`}>
                    <div className="card w-100">
                      <div className="row p-3">
                        <img
                          src="/3500.png"
                          className="card_profile col-2 "
                          style={{ height: "50px" }}
                        />

                        <form
                          className="col-9"
                          method="post"
                          target="#here"
                          onSubmit={(e) => {
                            e.preventDefault();
                            commentPost(post._id);
                          }}
                        >
                          <input
                            type="text"
                            className=" comment_box mt-1 p-4"
                            placeholder="Say Somethings.."
                            value={comment}
                            onChange={(e) => {
                              setComment(e.target.value);
                            }}
                          />
                        </form>
                      </div>
                      <div className="card-body ">
                        {post?.comments.map((comment) => (
                          <div style={{ maxWidth: "500px" }} key={comment._id}>
                            <Comment
                              comment={comment}
                              post={post}
                              key={comment._id}
                            />
                          </div>
                        ))}
                        {createLoading == post._id && (
                          <div style={{ marginLeft: "2rem" }}>
                            <span className="loader-reply ms-5 mt-3"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <DeletePost />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
