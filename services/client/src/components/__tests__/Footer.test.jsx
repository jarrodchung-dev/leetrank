import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Footer from "../Footer.jsx";

describe("<Footer />", () => {
  it("renders properly", () => {
    const wrapper = shallow(<Footer />);
    const span = wrapper.find("span");
    expect(span.text()).toBe("Copyright © 2020 Jarrod Chung");
  });

  it("renders a snapshot successfully", () => {
    const tree = renderer.create(<Footer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
