import React, { useState, useEffect, useRef } from "react";
import { Route, Link } from "react-router-dom";

const NavBar = (props) => {
  const node = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", handleMoveOutside);
    document.addEventListener("keydown", handleMoveOutside);
    return () => {
      document.removeEventListener("mousedown", handleMoveOutside);
      document.removeEventListener("keydown", handleMoveOutside);
    };
  }, []);
  const toggleNavBar = () => {
    let navToggle = document.querySelector(".nav-toggle");
    let navbarMenu = document.querySelector(".navbar-menu");
    navToggle.classList.toggle("is-active");
    navbarMenu.classList.toggle("is-active");
  };
  const handleMoveOutside = (event) => {
    if (node.current.contains(event.target)) {
      return;
    } else {
      let navToggle = document.querySelector(".nav-toggle");
      let navbarMenu = document.querySelector(".navbar-menu");
      navToggle.classList.remove("is-active");
      navbarMenu.classList.remove("is-active");
    }
  };
  return (
    <header>
      <nav className="navbar is-light">
        <section className="container">
          <div className="navbar-brand">
            <strong className="navbar-item" id="brand" ref={node}>
              {props.title}
            </strong>
            <span className="nav-toggle navbar-burger" onClick={toggleNavBar}>
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
              <Link to="/status" className="navbar-item">
                User Status
              </Link>
            </div>
            <div className="navbar-end">
              <Link to="/register" className="navbar-item">
                Register
              </Link>
              <Link to="/login" className="navbar-item">
                Log In
              </Link>
              <Link to="/logout" className="navbar-item">
                Log Out
              </Link>
            </div>
          </div>
        </section>
      </nav>
    </header>
  );
};

export default NavBar;