import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";
import DefaultProfile from "../../images/defaultProfile.gif";
import DeleteUser from "./DeleteUser/DeleteUser";

class ProfileAdmin extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      error: "",
      redirectToSignIn: false,
    };
  }

  //

  init = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //provides the current users jwt
        Authorization: `Bearer ${isAuthenticated().token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          if (this.props.match.params.addIdHere === ":addIdHere") {
            this.setState({
              error: "Add the selected user ID to the URL for user search up",
            });
          } else {
            this.setState({ error: data.error });
          }
        } else {
          //set the state
          this.setState({ user: data.data });
        }
      });
  };

  //

  //

  // allows admin to search for any user through their users by putting in the url
  componentDidMount() {
    const userId = this.props.match.params.addIdHere;
    //
    this.init(userId);
  }

  //

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

          {!this.state.error ? (
            <>
              {/* ---- */}
              <div className="col-md-6">
                <div className="lead mt-2">
                  <p>{this.state.user.name}</p>
                  <p>{this.state.user.email}</p>
                  <p>
                    {`Joined: ${new Date(
                      this.state.user.created
                    ).toDateString()}`}
                  </p>
                </div>
                {isAuthenticated().user.role === "admin" ? (
                  <div className="d-inline-block">
                    <button className="btn btn-raised btn-success mr-5">
                      Edit Profile
                    </button>
                    <DeleteUser  />
                  </div>
                ) : null}
              </div>
              {/* ---- */}
            </>
          ) : (
            <p>{this.state.error}</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileAdmin;
