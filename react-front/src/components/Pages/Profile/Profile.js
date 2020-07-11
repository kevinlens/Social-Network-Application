import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/defaultProfile.gif";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
    };
  }

  componentDidMount() {
    // const userId = this.props.match.params.addIdHere;
    // fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     //provides the current users jwt
    //     Authorization: `Bearer ${isAuthenticated().token}`,
    //   },
    // })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.error) {
    //       console.log(data.error);
    //     } else {
    //       //set the state
    //       this.setState({ user: data.data });
    //       console.log(this.state.user);
    //     }
    //   });
  }

  render() {
    const { user } = this.state;

    return (
      <div className="container">
        <div className="row">
          
          <div className="col-md-6">
            <h2 className="mt-5 mb-5">Profile</h2>
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
                <div className="lead mt-5 ml-5">
                  <p>Hello {isAuthenticated().user.name}</p>
                  <p>Email: {isAuthenticated().user.email}</p>
                  <p>
                    {`Joined: ${new Date(
                      isAuthenticated().user.created
                    ).toDateString()}`}
                  </p>
                </div>
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
