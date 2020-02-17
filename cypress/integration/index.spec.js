describe("Index", () => {
  it("users should be able to view the home page", () => {
    cy.visit("/")
      .get("h1")
      .contains("LeetRank");
  });
});
