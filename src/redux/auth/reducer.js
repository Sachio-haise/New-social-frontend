import axios from "axios";
import { GET_AUTH, LOGOUT } from "./types";
import CryptoJS from "crypto-js";
import decode from "jwt-decode";
import { server_url } from "../../config";

export const getAuth = () => async (dispatch) => {
  const auth = localStorage.getItem("a%t");

  if (auth) {
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

    const decodedToken = decode(decrypted.token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch({
        type: LOGOUT,
      });
      return;
    }
    const formData = new FormData();
    formData.append("token", decrypted.token);
    const res = await axios.post(`${server_url}/api/me`, formData, {
      headers: {
        Authorization: `Bearer ${decrypted.token}`,
      },
    });
    const { user, token } = res.data;
    if (user) {
      dispatch({
        type: GET_AUTH,
        payload: res.data,
      });
    }
  }
};
