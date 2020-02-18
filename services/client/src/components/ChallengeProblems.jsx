import React, { Component } from "react";

class ChallengeProblems extends Component {
  constructor(props) {
    this.state = {
      exercises: []
    };
    this.getChallengeProblems = this.getChallengeProblems.bind(this);
  }
  componentDidMount() {
    this.getChallengeProblems();
  }
  getChallengeProblems() {
    const problems = [
      {
        id: 0,
        body: `Define a function called sum that takes two integers as arguments
      and returns their sum.`
      },
      {
        id: 1,
        body: `Define a function called reverse that takes a string as an argument and returns 
        the string in reversed order.`
      },
      {
        id: 2,
        body: `Define a function called factorial that takes a random number as an argument and
        returns the factorial of that given number.`
      }
    ];
    this.setState({ exercises });
  }
  render() {
    return (
      <div className="container">
        <p>Challenge Problems Component Goes Here</p>
        {this.state.exercises.length &&
          this.state.exercises.map((exercise) => {
            return (
              <div className="box is-shadowless is-borderless">
                <div className="">{exercise.body}</div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default ChallengeProblems;
