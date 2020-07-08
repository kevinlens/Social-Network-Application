import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";
import DefaultProfile from '../../images/defaultProfile.gif'
class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
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
          this.setState({ error: data.error });
        } else {
          this.setState({ users: data.users });
        }
      });
  }

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        // <!-- Card -->
        <div className="card col-md-4" key={i}>
          {/* <!-- Card image --> */}
          <div className="view overlay">
            <img
              className="card-img-top"
              src={DefaultProfile}
              alt={user.name}
            />
          </div>

          {/* <!-- Card content --> */}
          <div className="card-body">
            {/* <!-- Title --> */}
            <h4 className="card-title">{user.name}</h4>
            {/* <!-- Text --> */}
            <p className="card-text">{user.email}</p>
            {/* <!-- Button --> */}
            <a href="#" className="btn btn-raised btn-primary btn-sm">
              View Profile
            </a>
          </div>
        </div>
        // <!-- Card -->
      ))}
    </div>
  );

  render() {
    const { users, error } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {!error ? <>{this.renderUsers(users)}</> : <p>{error}</p>}
      </div>
    );
  }
}
export default Users;
