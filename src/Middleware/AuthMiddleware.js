import { Outlet, Navigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Sidebar from "../components/Layout/Admin/Sidebar";
var auth = localStorage.getItem("a%t");
var user;
if (auth) {
  user = JSON.parse(
    CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(auth, "secret", {
        keySize: 128 / 8,
        iv: "secret",
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      })
    )
  );
}
export const HasAuth = () => {
  return auth ? <Navigate to="/" /> : <Outlet />;
};

auth = "";

export const IsAdmin = () => {
  var auth = localStorage.getItem("a%t");
  var user;
  if (auth) {
    user = JSON.parse(
      CryptoJS.enc.Utf8.stringify(
        CryptoJS.AES.decrypt(auth, "secret", {
          keySize: 128 / 8,
          iv: "secret",
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        })
      )
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 d-none d-md-none  d-lg-block mt-3 ">
          <Sidebar />
        </div>
        <div className="col-lg-9">
          {user.user.isAdmin == "admin" ? <Outlet /> : <Navigate to="/" />}
        </div>
      </div>
    </div>
  );
};
