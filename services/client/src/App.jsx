import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Users from "./components/Users.jsx";
import AddUser from "./components/AddUser.jsx";
import About from "./components/About.jsx";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      username: "",
      email: ""
    };
    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { username, email } = this.state;
    const data = { username, email };
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => {
        this.setState({ username: "", email: "" }, () => {
          this.getUsers();
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <section className="section">
        <div className="container is-fluid">
          <div className="columns">
            <div className="column is-2"></div>
            <div className="column is-8">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => {
                    return (
                      <>
                        <h1 className="title is-1 has-text-centered">All Users</h1>
                        <hr />
                        <br />
                        <AddUser
                          username={this.state.username}
                          email={this.state.email}
                          handleSubmit={this.handleSubmit}
                          handleChange={this.handleChange}
                        />
                        <br />
                        <br />
                        <Users users={this.state.users} />
                      </>
                    );
                  }}
                />
                <Route exact path="/about" component={About} />
              </Switch>
            </div>
            <div className="column is-2"></div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
