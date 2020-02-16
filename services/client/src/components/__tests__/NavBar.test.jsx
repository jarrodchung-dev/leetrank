import React from "react";
import { shallow } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import NavBar from "../NavBar.jsx";

const title = "NotHackerRank";

describe("<NavBar />", () => {
  it("should render properly", () => {
    const wrapper = shallow(<NavBar title={title} />);
    const element = wrapper.find("strong");
    expect(element.length).toBe(1);
    expect(element.get(0).props.children).toBe(title);
  });

  it("should render a snapshot successfully", () => {
    const tree = renderer
      .create(
        <Router location="/">
          <NavBar title={title} />
        </Router>
      )
      .toJSON();
  });
});
