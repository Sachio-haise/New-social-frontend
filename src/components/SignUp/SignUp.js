import React, { useState } from "react";
import axios from "axios";
import CryptoJS, { enc } from "crypto-js";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { server_url } from "../../config";
function SignUp() {
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_Password] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!login && confirm_password != password) {
      setErrors({ password: "Passwords do not match!" });
    }
    var res;
    const formData = new FormData();
    if (!login) {
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      res = await axios.post(`${server_url}/api/sign-up`, formData);
    } else {
      formData.append("email", email);
      formData.append("password", password);

      res = await axios.post(`${server_url}/api/sign-in`, formData);
    }
    if (res.data.errors) {
      setErrors(res.data.errors);
    } else {
      const token = res.data.token;
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(res.data),
        "secret",
        {
          keySize: 128 / 8,
          iv: "secret",
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();
      localStorage.setItem("a%t", encrypted);
      if (res.data.user.email_verify_at != null) {
        navigate(`/`);
      } else {
        navigate(`/verify/${token}`);
      }
    }
    setLoading(false);
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-6 offset-3 mt-5">
          <form className="sign-up mx-auto p-4" onSubmit={auth}>
            <img
              src="/rsz_logosample_bytailorbrands-removebg-preview-removebg-preview.png"
              width="30%"
              className="d-block mx-auto mb-4"
            />
            <h2 className="text-center text-danger fw-bold">SIGN UP</h2>
            {!login && (
              <div className="pb-3">
                <label className="d-block fs-5 text-light fw-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="input py-1 px-2 "
                  placeholder="Name.."
                  onChange={(e) => setName(e.target.value)}
                />
                {errors && (
                  <small className="text text-danger fw-bold">
                    {errors.name}
                  </small>
                )}
              </div>
            )}
            <div className="pb-3">
              <label className="d-block fs-5 text-light fw-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="input py-1 px-2 "
                placeholder="Email.."
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors && (
                <small className="text text-danger fw-bold">
                  {errors.email}
                </small>
              )}
            </div>
            <div className="pb-3">
              <label className="d-block fs-5 text-light fw-bold mb-2">
                Password
              </label>
              <input
                type="password"
                className="input py-1 px-2 "
                placeholder="Password.."
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors && (
                <small className="text text-danger fw-bold">
                  {errors.password}
                </small>
              )}
            </div>
            {!login && (
              <div className="pb-3">
                <label className="d-block fs-5 text-light fw-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="input py-1 px-2 "
                  placeholder="Confirm Password.."
                  onChange={(e) => setConfirm_Password(e.target.value)}
                />
                {errors && (
                  <small className="text text-danger fw-bold">
                    {errors.password}
                  </small>
                )}
              </div>
            )}
            <div className="pb-3">
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
                {login ? "LOGIN" : "SIGN UP"}
              </button>
              <Link to="/" className="btn text-light fw-bold me-3">
                Cancel
              </Link>
            </div>
            <div className="text-light">
              <span>
                {login ? "Do not have account?" : "Already have account?"}
              </span>
              <a
                href="#"
                className="ms-1 text-danger"
                onClick={() => setLogin(!login)}
              >
                {login ? "SIGN UP" : "SIGN IN"}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
