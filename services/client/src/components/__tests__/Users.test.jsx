import React from "react";
import { shallow, mount } from "enzyme";
import renderer from "react-test-renderer";

import Users from "../Users.jsx";

const users = [
  {
    id: 1,
    email: "testuser@example.com",
    username: "testuser",
    active: true
  },
  {
    id: 2,
    email: "testuser2@example.com",
    username: "testuser2",
    active: true
  }
];

describe("<Users />", () => {
  it("displays users passed down as props", () => {
    const wrapper = mount(<Users users={users} />);
    const element = wrapper.find("p");
    expect(element.length).toBe(2);
    expect(element.get(0).props.children).toBe("testuser");
    expect(element.get(1).props.children).toBe("testuser2");
  });

  it("renders a snapshot successfully", () => {
    const tree = renderer.create(<Users users={users} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
