import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Form from "../Form.jsx";

const forms = [
  {
    type: "Register",
    title: "Register",
    data: {
      username: "",
      email: "",
      password: ""
    }
  },
  {
    type: "Login",
    title: "Log In",
    data: {
      email: "",
      password: ""
    }
  }
];

forms.forEach((form) => {
  describe(`${form.type} Form`, () => {
    let component = <Form type={form.type} title={form.title} data={form.data} />;
    let wrapper = shallow(component);
    it("renders the title of the form correctly", () => {
      let title = wrapper.find("h1.title");
      expect(title.length).toBe(1);
      expect(title.get(0).props.children).toBe(form.title);
    });

    it("renders only the fields that were passed in as props", () => {
      let fields = wrapper.find(".field");
      expect(fields.length).toBe(Object.keys(form.data).length);
      let prop = fields.get(0).props.children[1].props.children.props;
      expect(prop.name).toBe(Object.keys(form.data)[0]);
      expect(prop.value).toBe(Object.values(form.data)[0]);
    });

    it("renders a snapshot successfully", () => {
      let tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
