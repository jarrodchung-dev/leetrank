import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

const Exercise = (props) => {
  return (
    <>
      <span style={{ fontSize: "95%" }}>{props.exercise.body}</span>
      <AceEditor
        mode="python"
        theme="github"
        name={props.exercise.id.toString()}
        fontSize={12}
        height={"220px"}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={props.editor.value}
        style={{ marginBottom: "10px", marginTop: "10px" }}
        editorProps={{ $blockScrolling: Infinity }}
        onChange={props.handleChange}
      />
      {props.isAuthenticated && (
        <div>
          <button
            className="button"
            onClick={(event) => props.submitExercise(event, props.exercise.id)}
            disabled={props.editor.button.isDisabled}
          >
            Run Code
          </button>
          <br />
          <br />
          <div className="level">
            {props.editor.showGrading && (
              <h5 className="has-text-left">
                <span className="grade-text">Grading...</span>
              </h5>
            )}
            {props.editor.showCorrect && (
              <h5 className="has-text-left">
                <span className="grade-text">Correct!</span>
              </h5>
            )}
            {props.editor.showIncorrect && (
              <h5 className="has-text-left">
                <span className="grade-text">Incorrect!</span>
              </h5>
            )}
          </div>
        </div>
      )}

      <br />
    </>
  );
};

export default Exercise;
