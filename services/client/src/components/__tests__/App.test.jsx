import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import AceEditor from "react-ace";
import App from "../../App.jsx";

jest.mock("react-ace");

beforeAll(() => {
  global.localStorage = {
    getItem: () => "testToken"
  };
});

describe("<App />", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<App />);
  });

  it("will call componentDidMount", () => {
    const didMount = jest.fn();
    App.prototype.componentDidMount = didMount;
    App.prototype.AceEditor = jest.fn();
    const wrapper = mount(
      <Router>
        <App />
      </Router>
    );
    expect(didMount).toHaveBeenCalledTimes(1);
  });
});
