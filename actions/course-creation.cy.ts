describe("Admin Course Creation Flow", () => {
  // Use a custom command to log in as an admin before each test
  beforeEach(() => {
    // In a real setup, you would use a custom command like cy.login("ADMIN")
    // For this example, we'll visit the login page and fill it out.
    // This assumes you have a login page at /auth/login
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("admin@krazycoders.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/auth/login"); // Verify login was successful
  });

  it("should allow an admin to create, edit, and see a new course", () => {
    const courseTitle = `Test Course - ${new Date().getTime()}`;
    const courseDescription = "This is a test description for our new course.";

    // 1. Navigate to the course creation page
    cy.visit("/admin/courses");
    cy.contains("New Course").click();
    cy.url().should("include", "/admin/courses/new");

    // 2. Create the new course
    cy.get('input[name="title"]').type(courseTitle);
    cy.contains("Create Course").click();

    // 3. Should be redirected to the new course's edit page
    cy.url().should("include", "/admin/courses/");
    cy.contains("Course Setup").should("be.visible");
    cy.contains(courseTitle).should("be.visible");

    // 4. Go back to the main courses list and verify the new course is there
    cy.visit("/admin/courses");
    cy.contains(courseTitle).should("be.visible");
  });
});