import axios from "axios";
import { server_url } from "../../config";
import CryptoJS from "crypto-js";
import { GET_MESSAGES } from "./types";
export const getRoomMessage = (room_id) => async (dispatch) => {
  console.log(room_id);
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

  const res = await axios.get(`${server_url}/api/message/${room_id}`, {
    headers: {
      Authorization: `Bearer ${decrypted.token}`,
    },
  });
  dispatch({
    type: GET_MESSAGES,
    payload: res.data.data,
  });
};
