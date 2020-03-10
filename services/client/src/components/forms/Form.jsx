import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { registerFormRules, loginFormRules } from "./form-rules";
import FormErrors from "./FormErrors.jsx";

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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.allValid = this.allValid.bind(this);
    this.resetRules = this.resetRules.bind(this);
  }
  componentDidMount() {
    this.clearForm();
    this.validateForm();
  }
  componentDidUpdate() {}
  clearForm() {
    this.setState({
      formData: {
        username: "",
        email: "",
        password: ""
      }
    });
  }
  handleChange(event) {
    const formData = this.state.formData;
    formData[event.target.name] = event.target.value;
    this.setState(formData);
    this.validateForm();
  }
  handleSubmit(event) {
    event.preventDefault();
    const type = this.props.type;
    const formData = {
      email: this.state.formData.email,
      password: this.state.formData.password
    };
    if (type === "Register") {
      formData.username = this.state.formData.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${type.toLowerCase()}`;
    axios
      .post(url, formData)
      .then((res) => {
        this.clearForm();
        this.props.loginUser(res.data.auth_token);
      })
      .catch((err) => {
        if (type === "Login") {
          this.props.createMessage("User does not exist.", "danger");
        }
        if (type === "Register") {
          this.props.createMessage("That user already exists.", "danger");
        }
      });
  }
  validateForm() {
    const formData = this.state.formData;
    this.resetRules();
    if (this.props.type === "Register") {
      const rules = this.state.registerFormRules;
      if (formData.username.length > 5) rules[0].valid = true;
      if (formData.email.length > 5) rules[1].valid = true;
      if (this.validateEmail(formData.email)) rules[2].valid = true;
      if (formData.password.length > 10) rules[3].valid = true;
      this.setState({ registerFormRules: rules });
      if (this.allValid()) this.setState({ valid: true });
    }
    if (this.props.type === "Login") {
      const rules = this.state.loginFormRules;
      if (formData.email.length > 0) rules[0].valid = true;
      if (formData.password.length > 0) rules[1].valid = true;
      this.setState({ loginFormRules: rules });
      if (this.allValid()) this.setState({ valid: true });
    }
  }
  allValid() {
    let rules = loginFormRules;
    if (this.props.type === "Register") {
      rules = registerFormRules;
    }
    for (let rule of rules) {
      if (!rule.valid) return false;
    }
    return true;
  }
  resetRules() {
    const registerFormRules = this.state.registerFormRules;
    for (let rule of registerFormRules) {
      rule.valid = false;
    }
    this.setState({ registerFormRules: registerFormRules });
    const loginFormRules = this.state.loginFormRules;
    for (let rule of loginFormRules) {
      rule.valid = false;
    }
    this.setState({ loginFormRules: loginFormRules });
    this.setState({ valid: false });
  }
  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    let formRules = this.state.loginFormRules;
    if (this.props.type === "Register") {
      formRules = this.state.registerFormRules;
    }
    return (
      <>
        {this.props.type === "Login" && <h1 className="title">Log In</h1>}
        {this.props.type === "Register" && <h1 className="title">Register</h1>}
        <FormErrors type={this.props.type} rules={formRules} />
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
                required
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
                required
              />
            </div>
          </div>
          <button className="button" type="submit" disabled={!this.state.disabled}>
            Submit
          </button>
        </form>
      </>
    );
  }
}

export default Form;
