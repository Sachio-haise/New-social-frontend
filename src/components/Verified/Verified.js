import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import decode from "jwt-decode";
function Verified() {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const data = decode(params.token);
      const { user, token } = data;
      if (user && token) {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), "secret", {
          keySize: 128 / 8,
          iv: "secret",
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
        localStorage.setItem("a%t", encrypted);

        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    }
  });
  return <div>Verified</div>;
}

export default Verified;
