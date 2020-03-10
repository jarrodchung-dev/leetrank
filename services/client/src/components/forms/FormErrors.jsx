import React from "react";
import "./FormErrors.css";

const FormErrors = (props) => {
  return (
    <div className="container is-fluid" id="form-rules">
      <ul className="rules validation-list">
        {props.rules.map((rule) => {
          return (
            <li className={rule.valid ? "success" : "error"} key={rule.id}>
              {rule.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FormErrors;
