import React, { Component } from "react";
import axios from "axios";
import Exercise from "./Exercise.jsx";

class Exercises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentExercise: 0,
      exercises: [],
      editor: {
        value: "",
        button: { isDisabled: false },
        showGrading: false,
        showCorrect: false,
        showIncorrect: false
      },
      showButtons: { prev: false, next: false }
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitExercise = this.submitExercise.bind(this);
    this.nextExercise = this.nextExercise.bind(this);
    this.prevExercise = this.prevExercise.bind(this);
    this.resetEditor = this.resetEditor.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.getExercises = this.getExercises.bind(this);
  }
  componentDidMount() {
    this.getExercises();
  }

  handleChange(value) {
    const editor = this.state.editor;
    editor.value = value;
    this.setState(editor);
  }
  submitExercise(event, id) {
    event.preventDefault();
    const data = { answer: this.state.editor.value };
    const url = process.env.REACT_APP_API_GATEWAY_URL;
    axios
      .post(url, data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  getExercises() {
    const exercises = [
      {
        id: 0,
        body: "Define a function called sum..."
      },
      {
        id: 1,
        body: "Define a function called reverse..."
      },
      {
        id: 2,
        body: "Define a function called factorial..."
      }
    ];
    return this.setState({ exercises });
  }
  renderButtons() {}
  nextExercise() {}
  prevExercise() {}
  resetEditor() {}
  render() {
    return (
      <div>
        <h1 className="title is-3">Exercises</h1>
        <hr />
        {!this.props.isAuthenticated && (
          <div className="notification is-warning">
            <span>Please log in to submit an exercise.</span>
          </div>
        )}
        {this.state.exercises.length > 0 && (
          <Exercise
            exercise={this.state.exercises[this.state.currentExercise]}
            editor={this.state.editor}
            isAuthenticated={this.props.isAuthenticated}
            onChange={this.handleChange}
            submitExercise={this.submitExercise}
          />
        )}
        <div className="field is-grouped">
          {this.state.showButtons.prev && (
            <button className="button is-info" onClick={() => this.prevExercise()}>
              &lt; Prev
            </button>
          )}
          &nbsp; &nbsp;
          {this.state.showButtons.next && (
            <button className="button is-info" onClick={() => this.nextExercise()}>
              Next &gt;
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Exercises;
