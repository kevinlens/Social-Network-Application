import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";
import { Link } from "react-router-dom";
class Profile extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     user: "",
  //   };
  // }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="mt-5 mb-5">Profile</h2>
            <p>Hello {isAuthenticated().user.name}</p>
            <p>Email: {isAuthenticated().user.email}</p>
            <p>
              {`Joined: ${new Date(
                isAuthenticated().user.created
              ).toDateString()}`}
            </p>
          </div>

          <div className="col-md-6">
            {isAuthenticated() ? (
              <div className="d-inline-block mt-5">
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={"/user/updateAccount"}
                >
                  Edit Profile
                </Link>
                <button className="btn btn-raised btn-danger">
                  Delete Profile
                </button>
              </div>
            ) : null}
          </div>
          {/* ------------------------ */}
        </div>
      </div>
    );
  }
}

export default Profile;
