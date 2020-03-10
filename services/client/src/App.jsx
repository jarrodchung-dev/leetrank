import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Message from "./components/Message.jsx";
import Users from "./components/Users.jsx";
import AddUser from "./components/AddUser.jsx";
import Form from "./components/forms/Form.jsx";
import Exercises from "./components/Exercises.jsx";
import Logout from "./components/Logout.jsx";
import About from "./components/About.jsx";
import UserStatus from "./components/UserStatus.jsx";
import Footer from "./components/Footer.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "LeetRank",
      users: [],
      isAuthenticated: false,
      messageText: "",
      messageType: ""
    };
    this.getUsers = this.getUsers.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }
  componentDidMount() {
    this.getUsers();
    this.createMessage();
  }
  componentDidUpdate(prevProps, prevState) {
    if (window.localStorage.getItem("authToken")) {
      if (!this.state.isAuthenticated) {
        this.setState({ isAuthenticated: true });
      }
    }
  }
  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({ users: res.data.data.users });
      })
      .catch((err) => console.log(err));
  }
  loginUser(authToken) {
    window.localStorage.setItem("authToken", authToken);
    this.setState({ isAuthenticated: true }, () => {
      this.getUsers();
      this.createMessage("Welcome!", "success");
    });
  }
  logoutUser() {
    window.localStorage.clear();
    this.setState({ isAuthenticated: false });
  }
  createMessage(text = "Welcome!", type = "success") {
    this.setState({ messageText: text, messageType: type });
  }
  render() {
    return (
      <>
        <NavBar title={this.state.title} isAuthenticated={this.state.isAuthenticated} />
        <br />
        {this.state.messageType && this.state.messageText && (
          <Message type={this.state.messageType} text={this.state.messageText} />
        )}
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
                      <Exercises isAuthenticated={this.state.isAuthenticated} />
                    )}
                  />
                  <Route
                    exact
                    path="/all-users"
                    render={() => <Users users={this.state.users} />}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <Form
                        type={"Register"}
                        loginUser={this.loginUser}
                        logoutUser={this.logouUser}
                        isAuthenticated={this.state.isAuthenticated}
                        createMessage={this.createMessage}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <Form
                        type={"Login"}
                        loginUser={this.loginUser}
                        logoutUser={this.logoutUser}
                        isAuthenticated={this.state.isAuthenticated}
                        createMessage={this.createMessage}
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
                    path="/user-status"
                    render={() => (
                      <UserStatus isAuthenticated={this.state.isAuthenticated} />
                    )}
                  />
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
