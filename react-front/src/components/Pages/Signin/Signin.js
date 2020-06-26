import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirect: false,
      loading: false,
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ error: "" });
    this.setState({
      [field]: event.target.value,
    });
  };

  authenticate(jwt, next) {
    //makes sure window is available
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", JSON.stringify(jwt));
      next();
    }
  }

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    this.signin(user).then((data) => {
      data.error
        ? this.setState({ error: data.error, loading: false })
        : this.authenticate(data, () => {
            this.setState({ redirect: true });
          });
    });
  };

  signin = (user) => {
    return fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  signinForm = (email, password) => (
    <form>
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

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );

  render() {
    const { email, password, error, redirect, loading } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <section className="container">
        <h2 className="mt-5 mb-5">Signin</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {Array.isArray(error) ? error[0] : error}
        </div>

        {
            loading
            ? (<div className="jumbotron text-center">
                <h2>Loading...</h2>
               </div>
              )
            : ("")
        }

        {/* ====================== */}

        {this.signinForm(email, password)}
      </section>
    );
  }
}

export default Signin;
