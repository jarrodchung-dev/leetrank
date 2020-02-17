const randomstring = require("randomstring");
const username = randomstring.generate();
const email = `${email}@example.com`;
const password = "testPassword";

/**
 * 1. Should display the registration form
 * 2. Should allow users to register
 * 3. Should throw an error if the user name is taken
 * 4. Should throw an error if the email address is taken
 * 5. Should validate the password field (greater than 10 characters)
 */
describe("Register", () => {
  it("should display the registration form", () => {});
  it("should allow users to register for an account", () => {});
  it("should validate the password field", () => {});
  it("should throw an error if the username is already taken", () => {});
  it("should throw an error if the email is already taken", () => {});
});
