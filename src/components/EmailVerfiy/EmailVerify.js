import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server_url } from "../../config";

function EmailVerify() {
  const params = useParams();
  const [auth, setAuth] = useState("");
  const [resentFlag, setResentFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("a%t");
    const decrypted = JSON.parse(
      CryptoJS.enc.Utf8.stringify(
        CryptoJS.AES.decrypt(auth, "secret", {
          keySize: 128 / 8,
          iv: "secret",
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        })
      )
    );
    if (decrypted.token != params.token) {
      navigate("/");
    } else {
      setAuth(decrypted);
    }
  }, []);

  const resent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("token", auth.token);
    setLoading(true);
    const res = await axios.post(`${server_url}/api/resent`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const { user, token } = res.data;
    if (user) {
      if (user.email_verify_at != null) {
        navigate("/");
      }
      setLoading(false);
      setResentFlag(true);
    }
    setLoading(false);
  };
  return (
    <div className="contaier-fluid">
      <div className="col-6 offset-3 mt-5 ">
        <div className="sign-up mx-auto p-4">
          <img
            src="/rsz_logosample_bytailorbrands-removebg-preview-removebg-preview.png"
            className="d-block mx-auto mb-4"
          />
          <h3 className="text-center text-light fw-bold">CHECK YOUR EMAIL!</h3>

          <div className="text-light text-center my-3">
            We sent email to{" "}
            <span className="text-danger fw-bold">{auth.user?.email}</span>
            <p className="mt-3">Didn't get mail?</p>
          </div>
          <button
            className="btn mx-auto d-block fw-bold text-nowrap"
            style={
              loading
                ? { maxWidth: "200px", color: "red" }
                : { maxWidth: "200px" }
            }
            onClick={resent}
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

            {resentFlag ? "Resent" : "Send Again"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerify;
