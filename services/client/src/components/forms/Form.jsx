import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { registerFormRules, loginFormRules } from "./form-rules.js";
import FormErrors from "./FormErrors.jsx";
import PropTypes from "prop-types";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: "",
        email: "",
        password: ""
      },
      registerFormRules: registerFormRules,
      loginFormRules: loginFormRules,
      valid: false
    };
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  componentDidMount() {
    this.clearForm();
    this.validateForm();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm();
      this.validateForm();
    }
  }
  clearForm() {
    this.setState({
      formData: { username: "", email: "", password: "" }
    });
  }
  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.validateForm();
  }
  handleUserFormSubmit(event) {
    event.preventDefault();
    const formType = this.props.formType;
    const data = {
      email: this.state.formData.email,
      password: this.state.formData.password
    };
    if (formType === "Register") {
      data.username = this.state.formData.username;
    }
    const url = `${
      process.env.REACT_APP_USERS_SERVICE_URL
    }/auth/${formType.toLowerCase()}`;
    axios
      .post(url, data)
      .then((res) => {
        this.clearForm();
        this.props.loginUser(res.data.auth_token);
      })
      .catch((err) => {
        if (formType === "Login") {
          this.props.createMessage("User does not exist.", "danger");
        }
        if (formType === "Register") {
          this.props.createMessage("That user already exists.", "danger");
        }
      });
  }
  validateForm() {
    const self = this;
    const formData = this.state.formData;
    self.resetRules();
    if (self.props.formType === "Register") {
      const formRules = self.state.registerFormRules;
      if (formData.username.length > 5) formRules[0].valid = true;
      if (formData.email.length > 5) formRules[1].valid = true;
      if (this.validateEmail(formData.email)) formRules[2].valid = true;
      if (formData.password.length > 10) formRules[3].valid = true;
      self.setState({ registerFormRules: formRules });
      if (self.allTrue()) self.setState({ valid: true });
    }
    if (self.props.formType === "Login") {
      const formRules = self.state.loginFormRules;
      if (formData.email.length > 0) formRules[0].valid = true;
      if (formData.password.length > 0) formRules[1].valid = true;
      self.setState({ loginFormRules: formRules });
      if (self.allTrue()) self.setState({ valid: true });
    }
  }
  allTrue() {
    let formRules = loginFormRules;
    if (this.props.formType === "Register") {
      formRules = registerFormRules;
    }
    for (const rule of formRules) {
      if (!rule.valid) return false;
    }
    return true;
  }
  resetRules() {
    const registerFormRules = this.state.registerFormRules;
    for (const rule of registerFormRules) {
      rule.valid = false;
    }
    this.setState({ registerFormRules: registerFormRules });
    const loginFormRules = this.state.loginFormRules;
    for (const rule of loginFormRules) {
      rule.valid = false;
    }
    this.setState({ loginFormRules: loginFormRules });
    this.setState({ valid: false });
  }
  validateEmail() {
    if (this.state.email) {
      let email = this.state.email;
      let username = this.state.email.split("")[0];
      let domain = this.state.email.splt("")[1];
      if (email && domain) {
        return true;
      }
    }
  }
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    let formRules = this.state.loginFormRules;
    if (this.props.formType === "Register") {
      formRules = this.state.registerFormRules;
    }
    return (
      <div className="container is-fluid">
        <div className="box is-half">
          {this.props.formType === "Login" && (
            <h3 className="title is-3 has-text-centered">Log In</h3>
          )}
          {this.props.formType === "Register" && (
            <h3 className="title is-3 has-text-centered">Register</h3>
          )}
          <FormErrors formType={this.props.formType} formRules={formRules} />
          <div className="column is-one-quarter"></div>
          <div className="column">
            <form onSubmit={(event) => this.handleUserFormSubmit(event)}>
              {this.props.formType === "Register" && (
                <div className="field">
                  <label className="label is-md">Username:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input is-medium"
                      name="username"
                      type="text"
                      placeholder="e.g. johndoe123"
                      required
                      value={this.state.formData.username}
                      onChange={this.handleFormChange}
                    />
                    <span className="icon is-medium is-left">
                      <i className="fas fa-user"></i>
                    </span>
                    <span className="icon is-md is-right"></span>
                  </div>
                </div>
              )}
              <div className="field">
                <label className="label is-md">Email:</label>
                <div className="control has-icons-left">
                  <input
                    className="input is-medium"
                    name="email"
                    type="email"
                    placeholder="e.g. johndoe@email.com"
                    required
                    value={this.state.formData.email}
                    onChange={this.handleFormChange}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="icon is-right"></span>
                </div>
              </div>
              <div className="field">
                <label className="label is-md">Password:</label>
                <div className="control has-icons-left">
                  <input
                    className="input is-medium"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={this.state.formData.password}
                    onChange={this.handleFormChange}
                  />
                  <span className="icon is-medium is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                  <span className="icon is-medium is-right"></span>
                </div>
              </div>
              <input
                type="submit"
                className="button is-primary is-medium is-fullwidth"
                value="Submit"
                disabled={!this.state.valid}
              />
            </form>
            <div className="column is-one-quarter"></div>
          </div>
        </div>
      </div>
    );
  }
}

Form.propTypes = {
  formType: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired
};

export default Form;
