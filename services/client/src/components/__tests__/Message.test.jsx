import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Message from "../Message.jsx";

const messages = [
  {
    text: "Successful message",
    type: "success"
  },
  {
    text: "Danger message",
    type: "danger"
  }
];

messages.forEach((message) => {
  describe(`<Message ${message.type} />`, () => {
    it("renders with the correct text and type", () => {
      const wrapper = shallow(<Message text={message.text} type={message.type} />);
      const element = wrapper.find(`.notification.is-${message.type}`);
      expect(element.length).toBe(1);
      const span = wrapper.find("span");
      expect(span.length).toBe(1);
      expect(span.get(0).props.children).toContain(message.text);
    });
    it("renders a snapshot successuly", () => {
      const tree = renderer
        .create(<Message text={message.text} type={message.type} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
