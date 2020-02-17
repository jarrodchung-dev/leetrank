import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import AuthForm from "../AuthForm.jsx";

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
  describe(`<${form.type} Form /> (not authenticated)`, () => {
    const component = (
      <AuthForm type={form.type} data={form.data} isAuthenticated={false} />
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
    });

    it("submits the form correctly", () => {
      wrapper.instance().handleSubmit = jest.fn();
      wrapper.update();
      const input = wrapper.find(`input[type="email"]`);
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledTimes(0);
      input.simulate("change", {
        target: {
          name: "email",
          value: "test_user@example.com"
        }
      });
      wrapper.find("form").simulate("submit", form.data);
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledWith(form.data);
      expect(wrapper.instance().handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("renders a snapshot successfully", () => {
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe(`<${form.type} Form /> (authenticated)`, () => {
    const component = (
      <AuthForm type={form.type} data={form.data} isAuthenticated={true} />
    );
    const wrapper = shallow(component);

    it("redirects away from <AuthForm />", () => {
      expect(wrapper.find("Redirect")).toHaveLength(1);
    });
  });
});

/*


*/
