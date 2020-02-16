import React, { Component } from "react";
import { Link } from "react-router-dom";

class Logout extends Component {
  componentDidMount() {
    this.props.logoutUser();
  }
  render() {
    return (
      <div className="container is-fluid">
        <p>You are now logged out.</p>
        <p>
          Click
          <Link className="link" to="/login">
            here
          </Link>{" "}
          to log in again.
        </p>
      </div>
    );
  }
}

export default Logout;
