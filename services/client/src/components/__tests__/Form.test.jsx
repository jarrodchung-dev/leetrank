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
    },
    handleChange: jest.fn(),
    handleSubmit: jest.fn()
  },
  {
    type: "Login",
    title: "Log In",
    data: {
      email: "",
      password: ""
    },
    handleChange: jest.fn(),
    handleSubmit: jest.fn()
  }
];

forms.forEach((form) => {
  describe(`<${form.type} Form /> (not authenticated)`, () => {
    const component = (
      <Form
        type={form.type}
        data={form.data}
        handleChange={form.handleChange}
        handleSubmit={form.handleSubmit}
        isAuthenticated={false}
      />
    );
    const wrapper = shallow(component);

    it("renders the title of the form correctly", () => {
      const title = wrapper.find("h1.title");
      expect(title.length).toBe(1);
      expect(title.get(0).props.children).toBe(form.title);
    });

    it("renders only the fields that were passed in as props", () => {
      const fields = wrapper.find(".field");
      expect(fields.length).toBe(Object.keys(form.data).length);
      const prop = fields.get(0).props.children[1].props.children.props;
      expect(prop.name).toBe(Object.keys(form.data)[0]);
      expect(prop.value).toBe(Object.values(form.data)[0]);
    });

    it("submits submits the form correctly", () => {
      const input = wrapper.find(`input[type="email"]`);
      expect(form.handleChange).toHaveBeenCalledTimes(0);
      expect(form.handleSubmit).toHaveBeenCalledTimes(0);
      input.simulate("change");
      expect(form.handleChange).toHaveBeenCalledTimes(1);
      wrapper.find("form").simulate("submit", form.data);
      expect(form.handleSubmit).toHaveBeenCalledWith(form.data);
      expect(form.handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("renders a snapshot successfully", () => {
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe(`<${form.type} Form /> (authenticated)`, () => {
    const component = (
      <Form
        type={form.type}
        data={form.data}
        handleChange={form.handleChange}
        handleSubmit={form.handleSubmit}
        isAuthenticated={true}
      />
    );
    const wrapper = shallow(component);

    it("redirects away from <Form />", () => {
      expect(wrapper.find("Redirect")).toHaveLength(1);
    });
  });
});

/*


*/
