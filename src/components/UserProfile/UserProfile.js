import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./UserProfile.css";
import { server_url } from "../../config";
import { getUsers } from "../../redux/admin/actions";
import { getRoomMessage } from "../../redux/chat/actions";

function UserProfile() {
  const auth = useSelector((state) => state.auth.auth);
  const [chatStatus, setChatStatus] = useState(true);
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [room_id, setRoomId] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var users = useSelector((state) =>
    state.admin.users.users?.filter((user) => user._id == params.id)
  );
  var user;
  if (users) {
    user = users[0];
  }

  useEffect(() => {
    if (user._id == auth.user?._id) {
      navigate("/user-profile");
    }
  });
  const getRoomId = async () => {
    setChatLoading(true);
    const formData = new FormData();
    formData.append("parent_user", params.id);
    formData.append("visiting_user", auth.user._id);
    const res = await axios.post(`${server_url}/api/create-room`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const { data } = res.data;
    console.log(res.data);
    setRoomId(data);
    console.log(room_id);
    await dispatch(getRoomMessage(data));
    setChatLoading(false);
  };

  const roomData = useSelector((state) => state.chat.messages);
  console.log(roomData);
  const sendMessage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    console.log(room_id);
    const formData = new FormData();
    formData.append("room_id", room_id);
    formData.append("creator", auth.user._id);
    formData.append("message", message);
    formData.append("file", file);
    const res = await axios.post(`${server_url}/api/message`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(res.data);
    setMessage("");
    setImage("");
    setFile("");
    dispatch(getRoomMessage(room_id));
    setBtnLoading(false);
  };

  return (
    <div className="container-fluid  mt-3">
      <div className="row">
        <div className="col-lg-4 col-md-12 col-sm-12 mx-auto">
          <div className="card profile p-3 mx-auto mb-3">
            <img
              src={user?.profile}
              className="card-img-top profile-pic mx-auto"
              alt="profile"
            />
            <div className="card-body mx-auto text-center">
              <legend className="fw-bold">{user?.name}</legend>
              <p>{user?.bio}</p>
              <button
                className="btn fw-bold"
                onClick={() => {
                  if (!auth.user) {
                    navigate("/auth");
                  } else {
                    getRoomId();
                    setChatStatus(!chatStatus);
                  }
                }}
              >
                Message
              </button>
            </div>
          </div>
        </div>
        {chatStatus ? (
          <div className="col-lg-6 col-md-10 offset-md-1 ">
            <div className="card profile-info p-3">
              <h2 className="mt-4 text-danger">General Information</h2>
              <table className="table table-borderless mt-3">
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <th>Account Age</th>
                    <td>{moment(user?.created_at).fromNow()}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>{user?.isAdmin}</td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="/" className="btn fw-bold">
                        GO BACK
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : chatLoading ? (
          <div className="col-lg-7 col-md-10 offset-md-1 ">
            <div className="card chat-loading">
              <div className="text-center my-auto ">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-lg-7 col-md-10 col-sm-12 offset-md-1 chat-box mb-4">
            <div className="card chat scrollbar" id="style-1">
              <div className="chat-header mx-auto mt-5">
                <img
                  src={roomData?.parent_user?.profile}
                  className="img1 ms-5"
                />
                <img src={roomData?.visiting_user?.profile} className="img2 " />
              </div>
              <div className="chat-subheader my-3 mx-auto">
                <h2 className="text-danger fw-bold">
                  {roomData?.parent_user.name}
                </h2>
              </div>
              <div className="chat-body mt-3">
                {roomData.message.map((message) =>
                  message.creator != auth.user?._id ? (
                    <div className=" d-flex flex-row-reverse ">
                      <div className="row my-2 me-2">
                        <div className="message-blue-right p-3  col-9 ">
                          <legend className="text-danger">
                            {roomData.parent_user.name}
                          </legend>
                          <p className="message-content fw-bold pt-2">
                            {message.message}
                          </p>
                          <div className="pt-3">
                            {moment(message.created_At).fromNow()}
                          </div>
                          {message.file && (
                            <div className="chat-image mt-3">
                              <img src={message.file} />
                            </div>
                          )}
                        </div>
                        <div className="col-1 ms-2">
                          <img
                            src={roomData.parent_user.profile}
                            className="chat-profile "
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row my-2 ms-2">
                      <div className="col-1">
                        <img
                          src={roomData.visiting_user.profile}
                          className="chat-profile "
                        />
                      </div>
                      <div className="message-blue p-3  col-9 ms-3">
                        <legend className="text-danger">
                          {roomData.visiting_user.name}
                        </legend>
                        <p className="message-content fw-bold pt-2">
                          {message.message}
                        </p>
                        <div className="pt-3">
                          {moment(message.created_At).fromNow()}
                        </div>
                        {message.file && (
                          <div className="chat-image mt-3">
                            <img src={message.file} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="chat-footer my-3 ms-3">
                {image && (
                  <img src={image} className="upload-img img-fluid  " />
                )}
                <div className="row">
                  <div className="col-1 ms-3">
                    <img src="/3500.png" className="profile-img " />
                  </div>
                  <div className="col-10 ms-3 d-flex">
                    <input
                      placeholder="Aa"
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="text-field p-1 mt-2"
                    />
                    <input
                      type="file"
                      className="d-none"
                      id="file_attach"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setImage(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                    <label htmlFor="file_attach" className="btn ms-2 fs-5">
                      <i className="fa-solid fa-paperclip"></i>
                    </label>
                    <button
                      className="btn ms-2 fs-5"
                      onClick={(e) => sendMessage(e)}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="fa-solid fa-paper-plane"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
