import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

import AddUser from "../AddUser.jsx";

test("AddUser renders properly", () => {
  const wrapper = shallow(<AddUser />);
  const form = wrapper.find("form");
  expect(form.find("input").length).toBe(3);
  expect(form.find("input").get(0).props.name).toBe("username");
  expect(form.find("input").get(1).props.name).toBe("email");
  expect(form.find("input").get(2).props.type).toBe("submit");
});
