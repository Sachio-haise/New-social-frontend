import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const [active, setActive] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [location]);
  return (
    <div className="side-menu p-0">
      <ul className="p-0">
        {isAdmin && (
          <>
            <li
              className={
                active == "home"
                  ? "py-2 px-5 border-start border-danger border-5 "
                  : "py-2 px-5 "
              }
            >
              <Link
                to="/dashboard"
                className={active == "home" ? "text-danger" : ""}
                onClick={() => setActive("home")}
              >
                Users
              </Link>
            </li>
            <li
              className={
                active == "blogs"
                  ? "py-2 px-5 border-start border-danger border-5 "
                  : "py-2 px-5 "
              }
            >
              <Link
                to="/dashboard-profile"
                className={active == "blogs" ? "text-danger" : ""}
                onClick={() => setActive("blogs")}
              >
                Profile
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
