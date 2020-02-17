import React, { useState, useEffect } from "react";

const Message = (props) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  });
  return (
    <>
      {visible && (
        <div className="container is-fluid has-text-centered" id="notification">
          <div className={`notification is-${props.type}`}>
            <button className="delete" onClick={() => setVisible(!visible)}></button>
            <span>{props.text}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
