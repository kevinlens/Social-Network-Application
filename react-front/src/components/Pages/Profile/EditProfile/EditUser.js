import React, { Component } from "react";
import { isAuthenticated } from "../../../Auth/Auth";

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
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
          this.setState({ error: data.error });
        } else {
          //set the state
          this.setState({
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
          });
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

  handleChange = (field) => (event) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    //
    this.setState({ loading: true });
    const { name, email, password, passwordConfirm } = this.state;
    const user = {
      name,
      email,
      password,
      passwordConfirm,
    };
    console.log(user);
  };
  //   signup(user).then((data) => {
  //     if (data.error) this.setState({ error: data.error, loading: false });
  //     else
  //       this.setState({
  //         name: "",
  //         email: "",
  //         password: "",
  //         error: "",
  //         created: true,
  //       });
  //   });
  // };
  signupForm = (name, email, password, passwordConfirm) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password Confirm</label>
        <input
          onChange={this.handleChange("passwordConfirm")}
          type="password"
          className="form-control"
          value={passwordConfirm}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );

  //

  render() {
    const { name, email, password, passwordConfirm } = this.state;
    return (
      <section className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        {this.signupForm(name, email, password, passwordConfirm)}
      </section>
    );
  }
}

export default EditUser;
