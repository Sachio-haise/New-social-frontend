import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
function UserProfile() {
  const user = useSelector((state) => state.transfer.user_data);

  return (
    <div className="container-fluid  mt-3">
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="card profile p-3 mx-auto mb-3">
            <img
              src={user.profile}
              className="card-img-top profile-pic mx-auto"
              alt="profile"
            />
            <div className="card-body mx-auto text-center">
              <legend className="fw-bold">{user?.name}</legend>
              <p>{user?.bio}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-10 offset-md-1 ">
          <div className="card profile-info p-3">
            <h2 className="mt-4 text-danger">General Information</h2>
            <table className="table table-borderless mt-3">
              <tbody>
                <tr>
                  <th>Email</th>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <th>Account Age</th>
                  <td>{moment(user?.created_at).fromNow()}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td>{user?.isAdmin}</td>
                </tr>
                <tr>
                  <td>
                    <Link to="/" className="btn fw-bold">
                      GO BACK
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
