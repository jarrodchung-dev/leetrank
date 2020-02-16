import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar.jsx";
import Users from "./components/Users.jsx";
import AddUser from "./components/AddUser.jsx";
import Form from "./components/Form.jsx";
import Logout from "./components/Logout.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "LeetRank",
      users: [],
      data: {
        username: "",
        email: "",
        password: ""
      },
      isAuthenticated: false
    };
    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.clearFormInputs = this.clearFormInputs.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({ users: res.data.data.users });
      })
      .catch((err) => console.log(err));
  }
  handleChange(event) {
    const data = this.state.data;
    data[event.target.name] = event.target.value;
    this.setState({ data });
  }
  handleSubmit(event) {
    event.preventDefault();
    const type = window.location.href.split("/").reverse()[0];
    let data = { email: this.state.data.email, password: this.state.data.password };
    if (type === "register") {
      data.username = this.state.data.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${type}`;
    axios
      .post(url, data)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }
  handleFormChange(event) {
    let data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    };
  }
  handleFormSubmit(event) {
    event.preventDefault();
    const type = window.location.href.split("/").reverse()[0];
    let data = {
      email: this.state.data.email,
      password: this.state.data.password
    };
    if (type === "register") {
      data.username = this.state.data.username;
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${type}`;
    axios
      .post(url, data)
      .then((res) => {
        this.clearFormInputs();
        window.localStorage.setItem("authToken", res.data.auth_token);
        this.setState({ isAuthenticated: true });
        this.getUsers();
      })
      .catch((err) => console.log(err));
  }
  clearFormInputs() {
    this.setState({
      data: { username: "", email: "", password: "" },
      username: "",
      email: ""
    });
  }
  logoutUser() {
    window.localStorage.clear();
    this.setState({ isAuthenticated: false });
  }
  render() {
    return (
      <>
        <NavBar title={this.state.title} />
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div className="column is-2"></div>
              <div className="column is-8">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <AddUser
                        title={"Add User"}
                        username={this.state.username}
                        email={this.state.email}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleFormSubmit}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <Form
                        type={"Register"}
                        data={this.state.data}
                        handleChange={this.handleChange}
                        handleFormSubmit={this.handleFormSubmit}
                        isAuthenticated={this.state.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <Form
                        type={"Login"}
                        data={this.state.data}
                        handleChange={this.handleChange}
                        handleFormSubmit={this.handleFormSubmit}
                        isAuthenticated={this.state.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/logout"
                    render={() => (
                      <Logout
                        logoutUser={this.logoutUser}
                        isAuthenticated={this.state.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/users"
                    render={() => <Users users={this.state.users} />}
                  />
                  <Route exact path="/about" component={About} />
                </Switch>
              </div>
              <div className="column is-2"></div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }
}

export default App;
