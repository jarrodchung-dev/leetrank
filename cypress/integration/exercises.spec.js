const randomstring = require("randomstring");
const username = randomstring.generate();
const email = `${username}@example.com`;
const password = "random_password";

describe("Exercises", () => {
  it("should display the exercises correctly if a user is not logged in", () => {
    cy.visit("/")
      .get("h3.title")
      .contains("Exercises")
      .get(".notification.is-warning")
      .contains("Please log in to submit an exercise.")
      .get("button")
      .should("not.be.visible");
  });

  it("should allow users to submit an exercise if logged in", () => {
    cy.server();
    cy.route("POST", "auth/register").as("createUser");
    cy.route("POST", Cypress.env("REACT_APP_USERS_SERVICE_URL")).as("gradeExercise");

    cy.visit("/register")
      .get(`input[name="username"]`)
      .type(username)
      .get(`input[name="email"]`)
      .type(email)
      .get(`input[name="password"]`)
      .type(password)
      .get(`input[type="submit"]`)
      .click()
      .wait("@createUser");

    cy.get("h1")
      .contains("Exercises")
      .get(".notification.is-success")
      .contains("Welcome!")
      .get(".notification.is-danger")
      .should("not.be.visible")
      .get("button.button.is-primary")
      .contains("Run Code");

    cy.get("button")
      .contains("Run Code")
      .click()
      .wait(600)
      .get("h5 > .grade-text")
      .contains("Incorrect!");
  });
});
