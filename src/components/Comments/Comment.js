import React, { useEffect, useState } from "react";
import moment from "moment";

import "./Comment.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getPostsOnly } from "../../redux/post/actions";
import { LIKE_PENDING } from "../../redux/post/types";
import { server_url } from "../../config";
function Comment({ comment, post }) {
  const [isReply, setIsReply] = useState(false);
  const [parent_id, setParent_id] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setreplyLoading] = useState(false);
  const [likeLoading, setlikeLoading] = useState(false);
  const [like, setLike] = useState("");
  const [wait, setWait] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [target, setTarget] = useState("");
  var [likeCount, setLikeCount] = useState(0);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  var posts = useSelector((state) => state.post.posts);
  useEffect(() => {
    setLikeCount(comment.like.length);
  }, [comment]);
  const Reply = async (id) => {
    setreplyLoading(true);
    setIsReply(false);
    const formData = new FormData();
    formData.append("user_id", auth.user._id);
    formData.append("post_id", id);
    formData.append("parent_id", parent_id);
    formData.append("target_user", comment.user_id._id);
    formData.append("comment", reply);
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

    setReply("");
    setreplyLoading(false);
  };

  const Delete = async (id) => {
    setLoading(true);
    if (wait) {
      return;
    }
    setWait(true);
    const res = await axios.get(`${server_url}/api/comment-delete/` + id, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setTimeout(() => {
      setWait(false);
    }, [1000]);
    await dispatch(getPostsOnly());

    console.log(res.data);
    setLoading(false);
  };

  const Like = async (id) => {
    if (likeLoading) {
      return;
    }
    setlikeLoading(true);

    const isLike = comment.like.find((id) => id == auth.user._id);

    if (isLike) {
      setLike("");
      setLikeCount(likeCount - 1);
    } else {
      setLike("#DC3545");
      setLikeCount(likeCount + 1);
    }

    const res = await axios.get(`${server_url}/api/comment-like/` + id, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setTimeout(() => setlikeLoading(false), 1000);
    dispatch(getPostsOnly());
    console.log(res.data);
  };
  const Edit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("comment", reply);
    const res = await axios.post(
      `${server_url}/api/comment-edit/` + comment._id,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    await dispatch(getPostsOnly());
    setLoading(false);
    setIsEdit(false);

    setIsReply(false);
  };
  return (
    <div className="row" key={comment._id}>
      <img
        src="/3500.png"
        className="card_profile col-2"
        style={{ height: "50px" }}
      />
      <div className="col-9  comment_section" style={{ position: "relative" }}>
        <div
          className={loading ? "message-blue p-3 blur-bg" : "message-blue p-3"}
        >
          <legend className="text-danger">{comment.user_id.name}</legend>
          <p className="message-content fw-bold pt-2">
            <span
              className={
                comment.target_user ? "text-danger fw-bold me-2" : "d-none"
              }
            >
              {comment.target_user?.name}
            </span>
            {comment.comment}
          </p>
          <div className="pt-3">{moment(comment.created_At).fromNow()}</div>
        </div>

        <div className={loading ? "blur-bg" : ""}>
          <button
            className="btn fw-bold bttn"
            onClick={() => {
              Like(comment._id);
            }}
          >
            <i style={{ color: like }} className="fa-solid fa-heart "></i>{" "}
            <span>{likeCount}</span>
          </button>
          <button
            className="btn fw-bold bttn"
            onClick={() => {
              setIsReply(!isReply);
              setIsEdit(false);
              setReply("");
              setParent_id(comment._id);
              setTarget(comment.user_id.name);
            }}
          >
            Reply
          </button>
          {comment.user_id._id == auth.user?._id && (
            <>
              <button
                className="btn fw-bold bttn"
                onClick={() => {
                  setIsReply(!isReply);
                  setReply(comment.comment);
                  setIsEdit(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn fw-bold bttn"
                onClick={() => {
                  Delete(comment._id);
                }}
              >
                Delete{" "}
              </button>
            </>
          )}
        </div>
        {isReply && (
          <div className=" p-3 d-flex ">
            <img
              src="/3500.png"
              className="card_profile me-2 mt-1"
              style={{ height: "50px", width: "50px" }}
            />

            <form
              className="w-100 d-block"
              method="post"
              target="#here"
              onSubmit={(e) => {
                e.preventDefault();
                if (isEdit) {
                  Edit();
                } else {
                  Reply(post._id);
                }
              }}
            >
              <input
                type="text"
                className=" reply_box mt-1 p-4 "
                value={reply}
                placeholder="Comment something.."
                onChange={(e) => setReply(e.target.value)}
              />
            </form>
          </div>
        )}
        {loading && (
          <div className="row spinner-position ">
            <span className="loader"></span>
          </div>
        )}
      </div>

      {comment.child_id.map((child) => (
        <div
          key={child._id}
          className={comment.parent_id == child.parent_id ? "" : "ms-2"}
        >
          <Comment comment={child} post={post} key={child._id} />
        </div>
      ))}

      <div className="ms-5">
        {replyLoading && <span className="loader-reply ms-5 mt-3"></span>}
      </div>
    </div>
  );
}

export default Comment;
