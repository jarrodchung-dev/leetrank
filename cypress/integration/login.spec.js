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
  it("should display the login form", () => {
    cy.visit("/login");
  });
  it("should allow users to register", () => {
    cy.visit("/register")
      .get(`input[name="username"]`)
      .type(username)
      .get(`input[name="email"]`)
      .type(email)
      .get(`input[name="password"]`)
      .type(password)
      .get(`button[type="submit"]`)
      .click();

    cy.get(".navbar-burger").click();
    cy.contains("Log Out").click();

    cy.get("a")
      .contains("Log In")
      .click()
      .get(`input[name="email"]`)
      .type(email)
      .get(`input[name="password"]`)
      .type(password)
      .get(`button[type="submit"]`)
      .click();
  });
  it("should throw an error if the login credentials are invalid", () => {});
  it("should allow users to log out after they have logged in", () => {});
});
