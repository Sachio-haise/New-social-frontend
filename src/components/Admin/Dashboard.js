import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../Layout/Admin/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/admin/actions";
import moment from "moment";
function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const users = useSelector((state) => state.admin.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [location]);
  console.log(users);
  return (
    <div className="row">
      <div className="col-10 offset-1 user-table table-responsive">
        <table className="table table-borderless mt-2">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">User Name</th>
              <th scope="col">Email</th>
              <th scope="col">Created at</th>
              <th scope="col">Email verified at</th>
              <th scope="col">Total Posts</th>
            </tr>
          </thead>
          <tbody className="fw-bold">
            {users.users &&
              users.users.map((user) => (
                <tr key={user._id}>
                  <th scope="row">{user._id}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{moment(user.created_at).fromNow()}</td>
                  <td>
                    {user.email_verify_at
                      ? moment(user.email_verify_at).fromNow()
                      : "Not verify yet!"}
                  </td>
                  <td>{user.posts.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
