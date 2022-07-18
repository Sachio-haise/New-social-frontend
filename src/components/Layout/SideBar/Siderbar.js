import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "../../../redux/auth/reducer";
import { LOGOUT } from "../../../redux/auth/types";
import { getPosts } from "../../../redux/post/actions";
import { REMOVE_DATA } from "../../../redux/transfer/types";
import "./Sidebar.css";
function Siderbar() {
  const [active, setActive] = useState("");
  const [isHome, setIsHome] = useState(true);
  var auth = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      location.pathname == "/user-profile" ||
      location.pathname.includes("/dashboard")
    ) {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
    dispatch(getPosts());

    dispatch(getAuth());
  }, [dispatch, location]);

  const logout = () => {
    auth = null;
    dispatch({
      type: LOGOUT,
    });
    navigate("/auth");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <img
            className="navbar-brand p-0 "
            src="/rsz_logosample_bytailorbrands-removebg-preview-removebg-preview.png"
          />

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            <span className="navbar-toggler-icon ">
              <i className="fa-solid fa-bars mt-2"></i>
            </span>
          </button>

          <div
            className="offcanvas offcanvas-start d-lg-none"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <button
              type="button"
              className="btn-close text-reset ms-auto  me-4 mt-4"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
            <div className="py-3">
              <div className="offcanvas-header">
                <div className="offcanvas-title mx-auto">
                  <img
                    className=" img-fluid profile-pic"
                    id="offcanvasExampleLabel"
                    src={auth.auth.user?.profile}
                  />
                </div>
              </div>
              <div className="text-center profile-descri fw-bold">
                <h2>{auth.auth.user?.name}</h2>
                <small>{auth.auth.user?.email}</small>
              </div>
            </div>
            <div className="dropdown ">
              <ul className="navbar-nav mb-lg-0" id="menu">
                {auth.auth.user && auth.auth.user.email_verify_at ? (
                  <>
                    {" "}
                    {auth.auth.user?.isAdmin == "user" ? (
                      <>
                        {" "}
                        {isHome ? (
                          <li>
                            <Link
                              to="/"
                              onClick={() => setActive("profile")}
                              className={
                                active == "profile"
                                  ? "nav-link offcanva-link px-4 py-3 align-middle text-danger"
                                  : "nav-link offcanva-link px-4 py-3 align-middle"
                              }
                            >
                              Profile
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link
                              to="/"
                              onClick={() => setActive("home")}
                              className={
                                active == "home"
                                  ? "nav-link offcanva-link px-4 py-3 align-middle text-danger"
                                  : "nav-link offcanva-link px-4 py-3 align-middle"
                              }
                            >
                              HOME
                            </Link>
                          </li>
                        )}
                      </>
                    ) : (
                      <>
                        {" "}
                        {isHome ? (
                          <li>
                            <Link
                              to="/dashboard"
                              onClick={() => setActive("dashboard")}
                              className={
                                active == "dashboard"
                                  ? "nav-link offcanva-link px-4 py-3 align-middle text-danger"
                                  : "nav-link offcanva-link px-4 py-3 align-middle"
                              }
                            >
                              Dashboard
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link
                              to="/"
                              onClick={() => setActive("home")}
                              className={
                                active == "home"
                                  ? "nav-link offcanva-link px-4 py-3 align-middle text-danger"
                                  : "nav-link offcanva-link px-4 py-3 align-middle"
                              }
                            >
                              HOME
                            </Link>
                          </li>
                        )}
                      </>
                    )}
                    <li>
                      <a
                        href="#submenu3"
                        onClick={() => setActive("btn1")}
                        data-bs-toggle="collapse"
                        className={
                          active == "btn1"
                            ? "nav-link offcanva-link px-4 align-middle text-danger py-3"
                            : "nav-link offcanva-link px-4 align-middle py-3"
                        }
                      >
                        BLOGS
                      </a>
                      <ul
                        className="collapse nav flex-column ms-1"
                        id="submenu3"
                        data-bs-parent="#menu"
                      >
                        <li className=" nav-link-parent py-2">
                          <a
                            href="#"
                            className="nav-link-child  px-0"
                            onClick={() => {
                              dispatch({
                                type: REMOVE_DATA,
                              });
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdroptwo"
                          >
                            {" "}
                            POST
                          </a>
                        </li>
                      </ul>
                    </li>{" "}
                  </>
                ) : (
                  <li>
                    <Link
                      to="/"
                      onClick={() => setActive("sign_up")}
                      className={
                        active == "sign_up"
                          ? "nav-link offcanva-link px-4 py-3 align-middle text-danger"
                          : "nav-link offcanva-link px-4 py-3 align-middle"
                      }
                    >
                      Sign Up
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <form className="d-flex input-group search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <button className="btn " type="submit">
                  <i className="fa-solid fa-magnifying-glass text-danger"></i>
                </button>
              </form>
            </ul>
            <ul>
              {" "}
              {auth.auth.user && auth.auth.user.email_verify_at ? (
                <li className="setting dropdown  mt-3">
                  <a
                    className="dropdown-toggle dropdown-toggle-split"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={auth.auth.user?.profile} />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end mt-3 me-5"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a
                        className="dropdown-item disabled"
                        href="#"
                        aria-disabled="true"
                        disabled
                        style={{ color: "red" }}
                      >
                        {auth.auth.user?.name}
                      </a>
                    </li>
                    <li>
                      <hr
                        className="dropdown-divider"
                        style={{ color: "white" }}
                      />
                    </li>
                    {auth.auth.user?.isAdmin == "user" ? (
                      <li>
                        {isHome ? (
                          <Link className="dropdown-item" to="/user-profile">
                            Profile
                          </Link>
                        ) : (
                          <Link className="dropdown-item" to="/">
                            Home
                          </Link>
                        )}
                      </li>
                    ) : (
                      <li>
                        {isHome ? (
                          <Link className="dropdown-item" to="/dashboard">
                            Dashboard
                          </Link>
                        ) : (
                          <Link className="dropdown-item" to="/">
                            Home
                          </Link>
                        )}
                      </li>
                    )}
                    <li>
                      <hr
                        className="dropdown-divider"
                        style={{ color: "white" }}
                      />
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => logout()}
                      >
                        LOGOUT
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <li
                  className=" pe-3 pt-2 fs-5"
                  style={{ listStyleType: "none" }}
                >
                  <Link to="/auth" className="sign_up">
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Siderbar;
