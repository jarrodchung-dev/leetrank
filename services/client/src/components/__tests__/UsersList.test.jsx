import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Users from "../Users.jsx";

const users = [
  {
    id: 99,
    username: "test_user",
    email: "test_user@example.com",
    active: true
  },
  {
    id: 100,
    username: "test_user2",
    email: "test_user2@example.com",
    active: true
  }
];

describe("<UsersList />", () => {
  it("displays user data receievd as props", () => {
    const wrapper = shallow(<Users users={users} />);
    const levelItem = wrapper.find("div.level-item");
    expect(levelItem.length).toBe(2);
  });

  it("renders a snapshot successfully", () => {
    const tree = renderer.create(<Users users={users} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
