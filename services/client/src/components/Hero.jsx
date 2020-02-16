import React, { Component } from "react";
import { Link } from "react-router-dom";

const Hero = (props) => (
  <div className="container is-fullhd is-mobile">
    <div className="hero is-light">
      <div className="hero-head">
        <div className="navbar">
          <div className="navbar-brand">
            <Link className="navbar-item" href="/">To Do App</Link>
            <span 
              className="navbar-toggle is-link navbar-burger"
              onClick={() => {
                let toggle = document.querySelector(".navbar-toggle");
                let menu = document.querySelector(".navbar-menu");
                toggle.classList.toggle("is-active"); menu.classList.toggle("is-active");
              }}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div className="navbar-menu has-text-centered">
            <div className="navbar-start has-icons-left">
              <Link to="/" className="navbar-item">
                <span><i className="fas fa-home"></i></span> &nbsp;
                Home
              </Link>
              {
                <Link to="/status" className="navbar-item">
                  <span><i className="fas fa-id-card"></i></span> &nbsp;
                  User Status
                </Link>
              }
              </div>
              <div className="navbar-end">
              {
                !props.isAuthenticated &&
                <Link to="/register" className="navbar-item">
                  <span><i className="fas fa-user-plus"></i></span> &nbsp;
                  Register
                </Link> 
              }
              {
                !props.isAuthenticated &&
                <Link to="/login" className="navbar-item">
                <span><i className="fas fa-sign-in-alt"></i></span> &nbsp;
                  Log In
                </Link> 
              }
              {
                props.isAuthenticated && 
                <Link to="/logout" className="navbar-item">
                  <span><i className="fas fa-sign-out-alt"></i></span> &nbsp;
                  Log Out
                </Link>
              }
              <Link to="/about" className="navbar-item">
                <span><i className="fas fa-info-circle"></i></span> &nbsp;
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="hero is-light">
      <div className="hero-body has-text-centered">
        <div className="hero-head">
          <h1 className="title is-3 text-is-centered">{props.title}</h1>
          &nbsp;
          <h2 className="subtitle is-6 text-is-centered">{props.subtitle}</h2>
        </div>
      </div>
    </div>
  </div>
)

export default Hero;
