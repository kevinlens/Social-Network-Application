import React, { Component } from "react";
//imported regular function
import { signup } from "../../Auth/Auth";
import { Link } from "react-router-dom";
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      error: "",
      created: false,
      loading: false,
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ error: "" });
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
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error, loading: false });
      else
        this.setState({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
          error: "",
          created: true,
        });
    });
  };

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

  render() {
    const {
      name,
      email,
      password,
      passwordConfirm,
      error,
      created,
      loading,
    } = this.state;

    return (
      <section className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {Array.isArray(error) ? error[0] : error}
        </div>
        {loading && !created ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}
        <div
          className="alert alert-info"
          style={{ display: created ? "" : "none" }}
        >
          New Account has been successfully created. Please{" "}
          <Link to="/signin">Sign In</Link>
        </div>

        {/* ====================== */}

        {this.signupForm(name, email, password, passwordConfirm)}
      </section>
    );
  }
}

export default Signup;
