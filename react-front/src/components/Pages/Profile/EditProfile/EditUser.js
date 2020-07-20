import React, { Component } from "react";
import { isAuthenticated } from "../../../Auth/Auth";
import {Redirect} from "react-router-dom";

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      error: "",
      loading: false,
      redirectToProfile: false,
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
        Update
      </button>
    </form>
  );

  //

  render() {
    const {
      id,
      name,
      email,
      password,
      passwordConfirm,
      error,
      loading,
      redirectToProfile
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    return (
      <section className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {Array.isArray(error) ? error[0] : error}
        </div>
        {/* ============== */}

        {this.signupForm(name, email, password, passwordConfirm)}
      </section>
    );
  }
}

export default EditUser;
