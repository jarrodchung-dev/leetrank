import React from "react";
import { Redirect } from "react-router-dom";

const Form = (props) => {
  if (props.isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {props.type === "Login" && <h1 className="title">Log In</h1>}
      {props.type === "Register" && <h1 className="title">Register</h1>}
      <form onSubmit={(event) => props.handleFormSubmit(event)}>
        {props.type === "Register" && (
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                name="username"
                value={props.data.username}
                className="input"
                type="text"
                onChange={props.handleChange}
              />
            </div>
          </div>
        )}
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              name="email"
              value={props.data.email}
              className="input"
              type="email"
              onChange={props.handleChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              name="password"
              value={props.data.password}
              className="input"
              type="password"
              onChange={props.handleChange}
            />
          </div>
        </div>
        <button className="button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
