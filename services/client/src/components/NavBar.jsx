import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = (props) => (
  // eslint-disable-next-line
  <header>
    <nav
      className="navbar is-mobile is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <button className="button is-light">
          <div className="navbar-item">
            <Link to="/">
              <strong>{props.title}</strong>
            </Link>
          </div>
        </button>
      </div>
    </nav>
  </header>
);

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default NavBar;

/*
<div className="container is-info">
  <div className="navbar-brand">
    <Link to="/">
      <button className="button is-light">
        <strong className="navbar-item">{props.title}</strong>
      </button>
    </Link>
    <span
      className="navbar-burger nav-toggle"
      onClick={() => {
        let toggle = document.querySelector(".nav-toggle");
        let menu = document.querySelector(".navbar-menu");
        toggle.classList.toggle("is-active");
        menu.classList.toggle("is-active");
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </span>
  </div>
  <div className="navbar-menu">
    <div className="navbar-start">
      <Link to="/" className="navbar-item">
        Home
      </Link>
      <Link to="/about" className="navbar-item">
        About
      </Link>
      <Link to="/all-users" className="navbar-item">
        Users
      </Link>
      {props.isAuthenticated && (
        <Link to="/status" className="navbar-item">
          User Status
        </Link>
      )}
    </div>
    <a href="/swagger" className="navbar-item">
      Swagger
    </a>
    <div className="navbar-end">
      {!props.isAuthenticated && (
        <div className="navbar-item">
          <Link to="/register" className="button is-primary">
            Register
          </Link>
          &nbsp;
          <Link to="/login" className="button is-link">
            Log In
          </Link>
        </div>
      )}
      {props.isAuthenticated && (
        <Link to="/logout" className="navbar-item">
          Log Out
        </Link>
      )}
    </div>
  </div>
</div>
*/
