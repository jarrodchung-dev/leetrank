import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      username: "",
      active: "",
      admin: "",
      isAutheenticated: false
    };
    this.getUserStatus = this.getUserStatus.bind(this);
  }
  componentDidMount() {
    if (window.localStorage.getItem("authToken")) {
      this.setState({ isAutheenticated: true }, () => {
        this.getUserStatus();
      });
    }
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
      .then((res) => {
        this.setState({
          email: res.data.data.email,
          id: res.data.data.id,
          username: res.data.data.username,
          active: String(res.data.data.active),
          admin: String(res.data.data.admin)
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    if (!this.state.isAutheenticated) {
      return (
        <>
          <p>You must be logged in to view this page.</p>
          <br />
          <p>
            Click <Link to="/login">here</Link> to login.
          </p>
        </>
      );
    }
    return (
      <>
        <div className="container has-text-centered">
          <table className="table is-hoverable is-striped is-fullwdith">
            <thead>
              <tr>
                <td>ID</td>
                <td>Email</td>
                <td>Username</td>
                <td>Active</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.id}</td>
                <td>{this.state.email}</td>
                <td>{this.state.username}</td>
                <td>{this.state.acitve}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
      </>
    );
  }
}

export default UserStatus;
