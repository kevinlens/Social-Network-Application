import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";

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
          console.log(data);
        }
      });
  }
  render() {
    const { users, error } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {!error ? (
          <div className="card">
            {users.map((user, i) => (
              <div key={i}>
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>{this.state.error}</p>
        )}
      </div>
    );
  }
}
export default Users;
