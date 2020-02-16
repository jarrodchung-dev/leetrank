import React, { Component } from "react";
import Users from "./components/Users.jsx";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
    this.getUsers = this.getUsers.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  getUsers() {
    axios
      .get("http://localhost:5001/users")
      .then((res) => {
        this.setState({ users: res.data.data.users }, () =>
          console.log(this.state.users)
        );
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <section>
        <div className="container is-fluid">
          <div className="columns">
            <div className="column is-2"></div>
            <div className="column is-8">
              <h1 className="title is-1 has-text-centered">All Users</h1>
              <br />
              <Users users={this.state.users} />
            </div>
            <div className="column is-2"></div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
