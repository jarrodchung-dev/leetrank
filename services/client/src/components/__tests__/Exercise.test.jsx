import React from "react";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import AceEditor from "react-ace";
import Exercise from "../Exercise.jsx";

jest.mock("react-ace");

beforeEach(() => {
  console.error = jest.fn();
  console.error.mockClear();
});

describe("Exercise", () => {
  const exercise = {
    id: 0,
    body:
      "Define a function called sum that takes two arguments as arguments and returns their sum"
  };
  const editor = {
    value: "",
    button: { isDisabled: false },
    showGrading: false,
    showCorrect: false,
    showIncorrect: false
  };

  it("renders properly", () => {
    const wrapper = shallow(
      <Exercise exercise={exercise} editor={editor} isAuthenticated={false} />
    );
    const span = wrapper.find("span");
    expect(span.length).toBe(1);
    expect(span.text()).toBe(exercise.body);
  });

  it("renders a snapshot properly when a user is authenticated", () => {
    let isAuthenticated = true;
    const tree = renderer
      .create(<Exercise exercise={exercise} editor={editor} isAuthenticated={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a snapshot properly when not authenticated", () => {
    const tree = renderer
      .create(<Exercise exercise={exercise} editor={editor} isAuthenticated={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
