describe("Index", () => {
  it("users should be able to view the home page", () => {
    cy.visit("/")
      .get("h1")
      .contains("LeetRank");
  });
  it("should display the page correctly if a user is not logged in", () => {});
});
