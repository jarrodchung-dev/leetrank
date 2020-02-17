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
      active: ""
    };
    this.getUserStatus = this.getUserStatus.bind(this);
  }
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.getUserStatus();
    }
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
      .then((res) => {
        console.log(res.data);
        this.setState({
          id: res.data.data.id,
          email: res.data.data.email,
          username: res.data.data.username
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    if (!this.props.isAutheenticated) {
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
        <div className="container">
          <table className="table is-hoverable is-striped is-fullwdith">
            <thead>
              <tr>
                <td>ID</td>
                <td>Email</td>
                <td>Username</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.id}</td>
                <td>{this.state.email}</td>
                <td>{this.state.username}</td>
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
