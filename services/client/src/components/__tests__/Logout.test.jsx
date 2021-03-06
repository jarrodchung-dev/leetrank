import React from "react";
import { shallow } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import Logout from "../Logout.jsx";
import renderer from "react-test-renderer";

const logoutUser = jest.fn();

describe("<Logout />", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<Logout logoutUser={logoutUser} />);
    const element = wrapper.find("p");
    expect(element.length).toBe(2);
    expect(element.get(0).props.children).toContain("You are now logged out.");
  });

  it("renders a snapshot correctly", () => {
    const tree = renderer
      .create(
        <Router>
          <Logout logoutUser={logoutUser} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
