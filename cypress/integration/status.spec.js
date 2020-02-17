const randomstring = require("randomstring");
const username = randomstring.generate();
const email = `${username}@example.com`;

/**
 * 1. Should display the info of the user if logged in
 * 2. Should not display user information if the user is not logged in.
 */
describe("User Status", () => {
  it("should display the user's information if logged in", () => {});
  it("should not display the user information if the user is not logged in", () => {});
});
