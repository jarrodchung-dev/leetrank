import React from "react";

const FormErrors = (props) => {
  return (
    <div className="container is-fluid" id="form-rules">
      <ul className="rules">
        {props.rules.map((rule) => {
          return (
            <li className={rule.valid ? "valid" : "invalid"} key={rule.id}>
              {rule.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FormErrors;
