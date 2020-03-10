import React, { useState } from "react";

const Home = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="container">
      <h1 className="title has-text-centered">{props.title}</h1>
      {isVisible && (
        <article className="message">
          <div className="message-header">
            <p>Welcome!</p>
            <button className="delete" onClick={() => setIsVisible(!isVisible)}></button>
          </div>
          <div className="message-body">Welcome to LeetRank.</div>
        </article>
      )}
    </div>
  );
};

export default Home;
