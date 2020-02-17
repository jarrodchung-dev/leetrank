import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      username: "",
      email: "",
      password: "",
      disabled: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.setState({ type: this.props.type });
    this.clearForm();
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const type = this.state.type;
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    if (type === "Register") {
      data.username = this.state.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${type.toLowerCase()}`;
    axios
      .post(url, data)
      .then((res) => {
        this.clearForm();
        this.props.loginUser(res.data.auth_token);
      })
      .catch((err) => console.log(err));

    if (type === "Login") {
      this.props.createMessage(
        "The username and password provided were incorrect",
        "danger"
      );
    }
    if (type === "Register") {
      this.props.createMessage("Sorry, that user already exists", "danger");
    }
  }
  clearForm() {
    this.setState({ username: "", email: "", password: "" });
  }
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        {this.props.type === "Login" && <h1 className="title">Log In</h1>}
        {this.props.type === "Register" && <h1 className="title">Register</h1>}
        <form onSubmit={this.handleSubmit}>
          {this.props.type === "Register" && (
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  name="username"
                  value={this.state.username}
                  className="input"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          )}
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                name="email"
                value={this.state.email}
                className="input"
                type="email"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                name="password"
                value={this.state.password}
                className="input"
                type="password"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <button className="button" type="submit" disabled={!this.state.disabled}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Form;
