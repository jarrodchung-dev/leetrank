import React from "react";

const Users = (props) => {
  return (
    <>
      <h3 className="title is-3 has-text-centered">Active Users</h3>
      <br />
      {props.users.map((user) => {
        return (
          <div className="level" key={user.id}>
            <div className="level-left">
              <div className="level-item">
                <p className="username">{user.username}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Users;
