import React from "react";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";
import AceEditor from "react-ace";
import Exercises from "../Exercises.jsx";

jest.mock("react-ace");

describe("<Exercises />", () => {
  it("renders properly when a user is not authenticated", () => {
    const wrapper = shallow(<Exercises isAuthenticated={false} />);
    const heading = wrapper.find("h1.title");
    expect(heading.length).toBe(1);
    const alert = wrapper.find(".notification");
    expect(alert.length).toBe(1);
    const message = wrapper.find(".notification > span");
    expect(message.get(0).props.children).toContain(
      "Please login to submit an exercise."
    );
  });

  it("renders properly when a user is authenticated", () => {
    const wrapper = shallow(<Exercises isAuthenticated={true} />);
    const heading = wrapper.find("h1.title");
    expect(heading.length).toBe(1);
    const alert = wrapper.find(".notification");
    expect(alert.length).toBe(0);
  });

  it("renders a snapshot successfully", () => {
    const tree = renderer.create(<Exercises />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("will call componentDidMount when mounted", () => {
    const didMount = jest.fn();
    Exercises.prototype.componentDidMount = didMount;
    const wrapper = mount(<Exercises />);
    expect(didMount).toHaveBeenCalledTimes(1);
  });
});
