import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "./Messenger.css";
import { server_url } from "../../config";
import axios from "axios";
import { getRooms } from "../../redux/chat/actions";
function Messenger() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [roomId, setRoomId] = useState("");
  const auth = useSelector((state) => state.auth.auth);
  const rooms = useSelector((state) => state.chat.rooms);
  const dispatch = useDispatch();
  console.log(rooms);
  const sendMessage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    console.log(roomId);
    const formData = new FormData();
    if (roomId) {
      formData.append("room_id", roomId);
    } else {
      formData.append("room_id", rooms[0]._id);
    }
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
    dispatch(getRooms());
    setBtnLoading(false);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 ">
          <div className="card chat-list mt-3">
            <div className="text-danger fw-bold ms-3 pt-2">
              <h3>Chat</h3>
            </div>
            {rooms.map((room) =>
              room.parent_user._id != auth.user._id ? (
                <div
                  className="chat-user d-flex align-items-center p-2"
                  key={room._id}
                  onClick={() => {
                    setRoomId(room._id);
                    setMessage("");
                  }}
                >
                  <img src={room.parent_user.profile} />
                  <p className="my-auto ms-2 fw-bold text-danger">
                    {room.parent_user.name}
                  </p>
                </div>
              ) : room.visiting_user._id != auth.user._id ? (
                <div
                  className="chat-user d-flex align-items-center p-2"
                  key={room._id}
                  onClick={() => {
                    setRoomId(room._id);
                    setMessage("");
                  }}
                >
                  <img src={room.visiting_user.profile} />
                  <p className="my-auto ms-2 fw-bold text-danger">
                    {room.visiting_user.name}
                  </p>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
        <div className="col-9 chat-box mb-4 mt-3">
          <div className="card chat scrollbar" id="style-1">
            <div className="chat-header mx-auto mt-5">
              <img src="/3500.png" className="img1 ms-5" />
              <img src="/3500.png" className="img2 " />
            </div>
            <div className="chat-subheader my-3 mx-auto">
              <h2 className="text-danger fw-bold">fsdf</h2>
            </div>
            <div className="chat-body mt-3">
              {roomId
                ? rooms.map(
                    (room) =>
                      room._id == roomId &&
                      room.message.map((message) =>
                        message.creator != auth.user._id ? (
                          <div
                            className=" d-flex flex-row-reverse "
                            key={message._id}
                          >
                            <div className="row my-2 me-2">
                              <div className="message-blue-right p-3  col-9 ">
                                <legend className="text-danger">
                                  {room.parent_user.name}
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
                                  src={room.parent_user.profile}
                                  className="chat-profile "
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="row my-2 ms-2" key={message._id}>
                            <div className="col-1">
                              <img
                                src={room.visiting_user.profile}
                                className="chat-profile "
                              />
                            </div>
                            <div className="message-blue p-3  col-9 ms-3">
                              <legend className="text-danger">
                                {room.visiting_user.name}
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
                      )
                  )
                : rooms[0]?.message.map((message) =>
                    message.creator != auth.user._id ? (
                      <div
                        className=" d-flex flex-row-reverse "
                        key={message._id}
                      >
                        <div className="row my-2 me-2">
                          <div className="message-blue-right p-3  col-9 ">
                            <legend className="text-danger">
                              {rooms[0].parent_user.name}
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
                              src={rooms[0].parent_user.profile}
                              className="chat-profile "
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row my-2 ms-2" key={message._id}>
                        <div className="col-1">
                          <img
                            src={rooms[0].visiting_user.profile}
                            className="chat-profile "
                          />
                        </div>
                        <div className="message-blue p-3  col-9 ms-3">
                          <legend className="text-danger">
                            {rooms[0].visiting_user.name}
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
              {image && <img src={image} className="upload-img img-fluid  " />}
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
      </div>
    </div>
  );
}

export default Messenger;
