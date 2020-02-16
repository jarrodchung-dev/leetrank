import React from "react";
import PropTypes from "prop-types";

const AddUser = (props) => {
  return (
    <form className="form" onSubmit={(event) => event.preventDefault()}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            name="username"
            type="text"
            placeholder="Enter you username"
            required
          />
          <input
            name="email"
            className="input"
            type="email"
            placeholder="Enter you email"
            required
          />
          <button className="button">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default AddUser;
