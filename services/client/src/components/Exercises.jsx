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
        value: "# Enter your code here!",
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
  getExercises() {
    return axios
      .get(`/exercises`)
      .then((res) => {
        let exercises = res.data.data.exercises;
        this.setState({ exercises }, () => {
          this.setState({ currentExercise: 0 });
        });
        this.renderButtons();
      })
      .catch((err) => {});
  }
  submitExercise(event, id) {
    event.preventDefault();
    const editor = this.state.editor;
    const exercise = this.state.exercises.filter((el) => el.id === id)[0];
    editor.showGrading = true;
    editor.showCorrect = false;
    editor.showIncorrect = false;
    editor.button.isDisabled = true;
    this.setState(editor);
    const code = {
      answer: this.state.editor.value,
      test: exercise.test_code,
      solution: exercise.test_solution
    };
    console.log(code);
    axios
      .post(process.env.REACT_APP_API_GATEWAY_URL, code)
      .then((res) => {
        editor.showGrading = false;
        editor.button.isDisabled = false;
        if (res.data && !res.data.errorType) {
          editor.showCorrect = true;
        }
        if (!res.data || res.data.errorType) {
          editor.showIncorrect = true;
        }
        this.setState(editor);
      })
      .catch((err) => {
        editor.showGrading = false;
        editor.button.isDisabled = false;
        console.log(err);
      });
  }

  renderButtons() {
    const currentExercise = this.state.currentExercise;
    let nextButton = false;
    let prevButton = false;
    if (typeof this.state.exercises[currentExercise + 1] !== "undefined") {
      nextButton = true;
    }
    if (typeof this.state.exercises[currentExercise - 1] !== "undefined") {
      prevButton = true;
    }
    this.setState({
      showButtons: {
        next: nextButton,
        prev: prevButton
      }
    });
  }
  nextExercise() {
    if (this.state.showButtons.next) {
      const currentExercise = this.state.currentExercise;
      this.setState({ currentExercise: currentExercise + 1 }, () => {
        this.resetEditor();
        this.renderButtons();
      });
    }
  }
  prevExercise() {
    if (this.state.showButtons.prev) {
      const currentExercise = this.state.currentExercise;
      this.setState({ currentExercise: currentExercise - 1 }, () => {
        this.resetEditor();
        this.renderButtons();
      });
    }
  }
  resetEditor() {
    const editor = {
      value: "# Enter your code here!",
      button: {
        isDisabled: false
      },
      showGrading: false,
      showCorrect: false,
      showIncorrect: false
    };
    this.setState({ editor });
  }
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
            handleChange={this.handleChange}
            submitExercise={this.submitExercise}
          />
        )}
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              {this.state.showButtons.prev && (
                <button className="button" onClick={this.prevExercise}>
                  &lt; Prev
                </button>
              )}
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              {this.state.showButtons.next && (
                <button className="button" onClick={this.nextExercise}>
                  Next &gt;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Exercises;
