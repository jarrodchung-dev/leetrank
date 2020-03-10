import React from "react";
import { shallow } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import NavBar from "../NavBar.jsx";

const title = "NotHackerRank";

describe("<NavBar /> when not authenticated", () => {
  const component = <NavBar tite={title} isAuthenticated={false} />;

  it("renders the title correctly", () => {
    const wrapper = shallow(component);
    const element = wrapper.find("strong");
    expect(element.length).toBe(1);
  });

  it("should conditionally show navbar items based on user auth status", () => {
    const wrapper = shallow(component);
    const navbarItems = wrapper.find("Link.navbar-item");
    expect(navbarItems.length).toBe(6);
    expect(navbarItems.get(0).props.children).toBe("Home");
    expect(navbarItems.get(1).props.children).toBe("About");
    expect(navbarItems.get(2).props.children).toBe("Users");
    expect(navbarItems.get(3).props.children).toBe("Exercises");
    const tree = renderer
      .create(
        <Router location="/">
          <NavBar title={title} />
        </Router>
      )
      .toJSON();
  });
});
