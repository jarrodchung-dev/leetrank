import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import App from "../../App";
import AceEditor from "react-ace";

beforeAll(() => {
  global.localStorage = {
    getItem: () => "testToken"
  };
});

test("App renders without crashing", () => {
  const wrapper = shallow(<App/>);
});

test("App will call componentWillMount when mounted", () => {
  const onWillMount = jest.fn();
  App.prototype.UNSAFE_componentWillMount = onWillMount;
  App.prototype.AceEditor = jest.fn();
  const wrapper = mount(<Router><App/></Router>);
  expect(onWillMount).toHaveBeenCalledTimes(1)
});