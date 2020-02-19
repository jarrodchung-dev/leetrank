import React from "react";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import AceEditor from "react-ace";
import Exercises from "../Exercises.jsx";

jest.mock("react-ace");

const exercises = [
  {
    id: 0,
    body: "Define a function called sum"
  },
  {
    id: 1,
    body: "Define a function called reverse"
  },
  {
    id: 2,
    body: "Define a function called factorial"
  }
];

beforeEach(() => {
  console.error = jest.fn();
  console.error.mockClear();
});

describe("<Exercises />", () => {
  it("renders properly when a user is not authenticated", () => {
    const didMount = jest.fn();
    Exercises.prototype.componentDidMount = didMount;
    const wrapper = shallow(<Exercises isAuthenticated={false} />);
    wrapper.setState({ exercises });
    const alert = wrapper.find(".notification");
    expect(alert.length).toBe(1);
    const message = wrapper.find(".notification > span");
    expect(message.get(0).props.children).toContain(
      "Please log in to submit an exercise."
    );
  });

  it("renders properly when a user is authenticated", () => {
    const didMount = jest.fn();
    Exercises.prototype.componentDidMount = didMount;
    const wrapper = shallow(<Exercises isAuthenticated={true} />);
    wrapper.setState({ exercises });
    const alert = wrapper.find(".notification");
    expect(alert.length).toBe(0);
  });

  it("renders a snapshot successfully", () => {
    const didMount = jest.fn();
    Exercises.prototype.componentDidMount = didMount;
    const tree = renderer.create(<Exercises />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls componentDidMount when mounted", () => {
    const didMount = jest.fn();
    Exercises.prototype.componentDidMount = didMount;
    const wrapper = mount(<Exercises />);
    expect(didMount).toHaveBeenCalledTimes(1);
  });
});

/*
it("calls componentDidUpdate when mounted", () => {
  const didUpdate = jest.fn();
  Exercises.prototype.componentDidUpdate = didUpdate;
  const wrapper = mount(<Exercises />);
  expect(didUpdate).toHaveBeenCalledTimes(1);
});
*/
