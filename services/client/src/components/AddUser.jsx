import React from "react";

const AddUser = (props) => {
  return (
    <form className="form" onSubmit={props.handleSubmit}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            name="username"
            value={props.username}
            type="text"
            placeholder="i.e. johnsmith"
            onChange={props.handleChange}
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            name="email"
            value={props.email}
            type="email"
            placeholder="i.e. johnsmith@example.com"
            onChange={props.handleChange}
            required
          />
        </div>
      </div>
      <button className="button">Submit</button>
    </form>
  );
};

export default AddUser;
