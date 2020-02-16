import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "bulma";
import "./index.css";
import "./fonts/FiraMono-Regular.ttf";
import "./fonts/FiraSans-Regular.ttf";
import "./fonts/Sudo-Regular.ttf";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
