const randomstring = require("randomstring");
const username = randomstring.generate();
const email = `${username}@example.com`;
const password = "random_password";

describe("Index", () => {
  it("users should be able to view the home page", () => {
    cy.visit("/")
      .get("h1")
      .contains("Exercises");
    cy.get(".navbar-burger")
      .click()
      .get("a")
      .contains("User Status")
      .should("not.be.visible")
      .get("a")
      .contains("Log Out")
      .should("not.be.visible")
      .get("a")
      .contains("Register")
      .get("a")
      .contains("Log In")
      .get("a")
      .contains("Users")
      .get(".notification.is-warning")
      .contains("Please log in to submit an exercise.")
      .get(".notification.is-success")
      .should("not.be.visible");

    cy.server();
    cy.route("POST", "/auth/register").as("createUser");
    cy.visit("/register")
      .get(`input[name="username"]`)
      .type(username)
      .get(`input[name="email"]`)
      .type(email)
      .get(`input[name="password"]`)
      .type(password)
      .get(`button[type="submit"]`)
      .click()
      .wait("@createUser");
    cy.get("h1")
      .contains("Exercises")
      .get(".navbar-burger")
      .click()
      .get("a")
      .contains("Log In")
      .should("not.be.visible")
      .get("a")
      .contains("Register")
      .should("not.be.visible")
      .get("a")
      .contains("Users")
      .get(".notification.is-warning")
      .should("not.be.visible")
      .get(".notification.is-success")
      .should("not.be.visible");
  });

  it("should display the page correctly if a user is logged in", () => {
    cy.server();
    cy.route("POST", "/auth/register").as("createUser");
  });
});
