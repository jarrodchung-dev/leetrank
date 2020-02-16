import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import PropTypes from "prop-types";

const Exercise = (props) => {
  return (
    <div key={props.exercise.id}>
      <h5 className="title is-5">{props.exercise.body}</h5>
      <AceEditor
        mode="python"
        theme="github"
        name={(props.exercise.id).toString()}
        fontSize={12}
        height={"220px"}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={props.editor.value}
        syle={{ marginBottom: "10px" }}
        editorProps={{ $blockScrolling: Infinity }}
        onChange={props.onChange}
      />
      <br/>
      {
        props.isAuthenticated &&
        <div>
          <button
            className="button is-primary"
            onClick={(event) => props.submitExercise(event, props.exercise.id)}
            disabled={props.editor.button.isDisabled}
          >Run Code</button>
          {
            props.editor.showGrading &&
            <h5 className="title is-5">
              <span className="icon is-large">
                <i className="fas fa-spinner fa-pulse"></i>
              </span>
              <span className="grade-text">Grading...</span>
            </h5>
          }
          {
            props.editor.showCorrect &&
            <h5 className="title is-5">
              <span className="icon is-large">
                <i className="fas fa-check"></i>
              </span>
              <span className="grade-text">Correct!</span>
            </h5>
          }
          {
            props.editor.showIncorrect &&
            <h5 className="title is-5">
              <span className="icon is-large">
                <i className="fas fa-times"></i>
              </span>
              <span className="grade-text">Incorrect!</span>
            </h5>
          }
        </div>
      }
      <br/>
    </div>
  )
};

Exercise.propTypes = {
  exercise: PropTypes.shape({
    body: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    test_code: PropTypes.string.isRequired,
    test_solution: PropTypes.string.isRequired,
  }).isRequired,
  editor: PropTypes.shape({
    button: PropTypes.object.isRequired,
    showCorrect: PropTypes.bool.isRequired,
    showGrading: PropTypes.bool.isRequired,
    showIncorrect: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onChange: PropTypes.bool.isRequired,
  submitExercise: PropTypes.func.isRequired,
}


export default Exercise;
