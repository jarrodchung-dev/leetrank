import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import AddUser from "../AddUser.jsx";

describe("<AddUser />", () => {
  it("renders properly", () => {
    const wrapper = shallow(<AddUser />);
    const element = wrapper.find("form");
    expect(element.find("input").length).toBe(2);
    expect(element.find("input").get(0).props.name).toBe("username");
    expect(element.find("input").get(1).props.name).toBe("email");
    expect(element.find("button").length).toBe(1);
    expect(element.find("button").text()).toBe("Submit");
  });

  it("should render a snapshot successfully", () => {
    const tree = renderer.create(<AddUser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
