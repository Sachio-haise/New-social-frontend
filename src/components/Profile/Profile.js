import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Profile.css";
import { useLocation } from "react-router-dom";
import { getAuth } from "../../redux/auth/reducer";
import { server_url } from "../../config";
import moment from "moment";
function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [profile, setProfile] = useState("");
  const [showprofile, setShowProfile] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  useEffect(() => {
    if (auth.user) {
      setEmail(auth.user.email);
      setName(auth.user.name);
      setUserProfile(auth.user.profile);
    }
    if (location.pathname.includes("/dashboard")) {
      setAdmin(true);
    }
  }, [auth, location, dispatch]);

  const updateBio = async () => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("profile", profile);
    const res = await axios.post(`${server_url}/api/update-bio`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setEditLoading(false);
    setEdit(false);

    dispatch(getAuth());
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("oldPassword", oldPassword);
    const res = await axios.post(`${server_url}/api/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setLoading(false);
    const { errors } = res.data;
    if (errors) {
      setError(errors);
      console.log(error);
    } else {
      console.log(res.data);
    }
    setTimeout(() => setError(""), 5000);
    dispatch(getAuth());
    setEdit(false);
  };
  return (
    <div className="container-fluid  mt-3">
      <div className="row">
        <div className={isAdmin ? "col-9 offset-1 " : "col-lg-4 col-md-12"}>
          <div className="card profile p-3 mx-auto mb-3">
            <div className="ms-auto ">
              <button className="btn" onClick={() => setEdit(!edit)}>
                <i className="fa-solid fa-pen-to-square fs-5 text-danger"></i>
              </button>
            </div>
            <img
              src={userProfile}
              className="card-img-top profile-pic mx-auto"
              alt="profile"
            />
            <div className="card-body mx-auto text-center">
              <legend className="fw-bold">Aung Kaung Myat</legend>
              <p>{auth.user?.bio}</p>
            </div>
            {edit && (
              <div className="card-footer p-2 my-3 edit-bio">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateBio();
                  }}
                >
                  <div className="row">
                    <label className="fs-4 text-danger fw-bold my-2">Bio</label>
                    <textarea
                      className="form-control"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                  <label
                    className="btn btn-sm  fw-bold fs-6 mt-3 fw-bold"
                    htmlFor="upload-profile"
                  >
                    Upload <i className="fa-solid fa-upload"></i>
                  </label>
                  <input
                    type="file"
                    className="d-none"
                    id="upload-profile"
                    onChange={(e) => {
                      setShowProfile(URL.createObjectURL(e.target.files[0]));
                      setProfile(e.target.files[0]);
                    }}
                  />
                  {showprofile && (
                    <div className="">
                      <img
                        src={showprofile}
                        className="profile-look img-fluid img-thumbnail"
                      />
                    </div>
                  )}
                  <div className="row my-3">
                    <button className="btn fw-bold" disabled={editLoading}>
                      {editLoading && (
                        <div
                          className="spinner-border text-light spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        <div
          className={
            isAdmin ? "col-9 offset-1 " : "col-lg-6 col-md-10 offset-md-1 "
          }
        >
          <div className="card profile-info p-3">
            <h2 className="mt-4 text-danger">General Information</h2>
            <table className="table table-borderless mt-3">
              <tbody>
                <tr>
                  <th>Email</th>
                  <td>{auth.user?.email}</td>
                </tr>
                <tr>
                  <th>Account Age</th>
                  <td>{moment(auth.user?.created_at).fromNow()}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td>{auth.user?.isAdmin}</td>
                </tr>
              </tbody>
            </table>

            <form className="mt-3 p-3" onSubmit={(e) => updateProfile(e)}>
              <div className="row  my-4">
                <label className=" col-3 fs-5 fw-bold">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  className="col-9 text-field p-1"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="row my-4">
                <label className=" col-3 fs-5 fw-bold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  className="col-9 text-field p-1"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="row my-4 field">
                <label className=" col-3 fs-5 fw-bold">
                  Old Password <span className="text-danger">*</span>
                </label>
                <div className="group col-9">
                  <input
                    className="col-9 text-field p-1"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <a
                    type="button"
                    onClick={() => {
                      setShowOldPassword(!showOldPassword);
                    }}
                  >
                    {showOldPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </a>
                </div>
                {error && (
                  <p
                    className="text text-danger text-start mt-3 fw-bold"
                    style={{ marginLeft: "8rem" }}
                  >
                    {error.password}
                  </p>
                )}
              </div>
              <div className="row my-4">
                <label className=" col-3 fs-5 fw-bold">
                  New Password <span className="text-danger">*</span>
                </label>
                <div className="group col-9">
                  <input
                    className="col-9 text-field p-1"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <a
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </a>
                </div>
              </div>
              <div className="row my-4">
                <button className="btn fw-bold" disabled={loading}>
                  {loading && (
                    <div
                      className="spinner-border text-light spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
