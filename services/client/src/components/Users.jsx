import React from "react";

const Users = (props) => {
  return (
    <>
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
    </>
  );
};

export default Users;
