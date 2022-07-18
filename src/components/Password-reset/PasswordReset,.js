import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { server_url } from "../../config";
import "./PasswordReset.css";
function PasswordReset() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [codeToken, setCodeToken] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const params = useParams();
  const auth = useSelector((state) => state.auth.auth);
  const navigate = useNavigate();

  const forgotPassword = async () => {
    console.log(email);
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    const res = await axios.post(`${server_url}/api/forgot-password`, formData);
    const { errors } = res.data;
    if (errors) {
      setError(errors);
      console.log(error);
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    setLoading(false);
    console.log(res.data);
    setCodeToken(res.data.token);
    setConfirm(true);
  };

  const confirmCode = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("code", code);
    const res = await axios.post(
      `${server_url}/api/confirm-code/` + codeToken,
      formData
    );
    const { token, errors } = res.data;
    if (errors) {
      setError(errors);
      console.log(error);
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    console.log(token);
    setReset(true);
    setConfirm(false);
    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("password", password);
    const res = await axios.post(
      `${server_url}/api/reset-password/` + codeToken,
      formData
    );
    console.log(res.data);
    setLoading(false);
    navigate("/");
  };
  return (
    <div className="contaier-fluid reset-password">
      <div className="col-8 offset-2 mt-5 ">
        <div className="sign-up mx-auto p-4">
          <img
            src="/rsz_logosample_bytailorbrands-removebg-preview-removebg-preview.png"
            className="d-block mx-auto mb-4"
          />
          <h3 className="text-center  fw-bold" style={{ color: "red" }}>
            Reset Password
          </h3>

          <div className="row reset-form my-3 ">
            {confirm ? (
              <>
                {" "}
                <label className="col-4 text-nowrap my-2  fw-bold fs-4">
                  Enter code that had sent to <br />
                  <span style={{ color: "white" }}>{email} :</span>{" "}
                </label>
                <input
                  type="text input"
                  className="ms-5 p-2"
                  value={code}
                  placeholder="Code..."
                  onChange={(e) => setCode(e.target.value)}
                />
                {error && (
                  <p
                    className="text-start ms-5 my-2 fw-bold "
                    style={{ color: "red" }}
                  >
                    {error.email}
                  </p>
                )}
              </>
            ) : true ? (
              <>
                {" "}
                <label className="col-4 text-nowrap my-2  fw-bold fs-4">
                  Enter a new password: :{" "}
                </label>
                <div className="group reset-form">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Password..."
                    className=" p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-action"
                    style={{ backgroundColor: "#2b2b2b" }}
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? (
                      <i className="fa-solid fa-eye"></i>
                    ) : (
                      <i className="fa-solid fa-eye-slash"></i>
                    )}
                  </button>
                </div>
                {error && (
                  <p
                    className="text-start ms-5 my-2 fw-bold "
                    style={{ color: "red" }}
                  >
                    {error.email}
                  </p>
                )}
              </>
            ) : (
              <>
                {" "}
                <label className="col-4 text-nowrap my-2  fw-bold fs-4">
                  Enter your eamil to reset password: :{" "}
                </label>
                <input
                  type="text input"
                  placeholder="Email..."
                  className="ms-5 p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && (
                  <p
                    className="text-start ms-5 my-2 fw-bold "
                    style={{ color: "red" }}
                  >
                    {error.email}
                  </p>
                )}
              </>
            )}
          </div>
          <button
            className="btn d-block fw-bold text-nowrap"
            style={{ maxWidth: "200px" }}
            onClick={() =>
              confirm
                ? confirmCode()
                : reset
                ? resetPassword()
                : forgotPassword()
            }
          >
            {loading && (
              <div
                className="spinner-border spinner-border-sm me-2"
                style={{ color: "red" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {confirm ? "Continue" : reset ? "Confirm" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
