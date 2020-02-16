import React from "react";

const Users = (props) => {
  return (
    <div className="container">
      <div className="columns" id="users">
        {props.users.map((user) => {
          return (
            <div className="level" key={user.id}>
              <div className="level-left">
                <div className="level-item">
                  <p>{user.username}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
