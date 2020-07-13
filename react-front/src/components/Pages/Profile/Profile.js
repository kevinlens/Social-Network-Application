import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/defaultProfile.gif";
import DisableUser from './DeleteUser/DisableUser'

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
    };
  }

  render() {
    const { user } = this.state;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>

        <div className="row">
          <div className="col-md-6">
            <img
              className="card-img-top"
              src={DefaultProfile}
              alt={user.name}
              style={{ width: "30vw", height: "40vh", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-6">
            {isAuthenticated() ? (
              <>
                <div className="lead mt-2">
                  <p>Hello {isAuthenticated().user.name}</p>
                  <p>Email: {isAuthenticated().user.email}</p>
                  <p>
                    {`Joined: ${new Date(
                      isAuthenticated().user.created
                    ).toDateString()}`}
                  </p>
                </div>
                <div className="d-inline-block">
                  <Link
                    className="btn btn-raised btn-success mr-5"
                    to={"/user/updateAccount"}
                  >
                    Edit Profile
                  </Link>
                <DisableUser />
                </div>
              </>
            ) : null}
          </div>
          {/* ------------------------ */}
        </div>
      </div>
    );
  }
}

export default Profile;
