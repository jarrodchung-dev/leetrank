const randomstring = require("randomstring");
const username = randomstring.generate();
const email = `${username}@example.com`;
const password = "testPassword";
/**
 * 1. Should display the login form
 * 2. Should allow users to sign in
 * 3. Should throw an error if the login credentials are invalid
 * 4. Should allow users to log out after they have logged in
 * 5. Should validate the password field
 */
describe("Login", () => {
  it("should display the login form", () => {});
  it("should allow users to login", () => {});
  it("should throw an error if the login credentials are invalid", () => {});
  it("should allow users to log out after they have logged in", () => {});
});
