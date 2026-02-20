describe('Login and Notes Flow', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('POST', '**/auth/login', {
      statusCode: 201,
      body: { access_token: 'fake-token' }
    }).as('login');

    cy.intercept('GET', '**/notes', {
      statusCode: 200,
      body: [
        { id: '1', title: 'Test Note', content: 'This is a test note', createdAt: new Date().toISOString() }
      ]
    }).as('getNotes');

    cy.visit('/');
  });

  it('should login and display notes', () => {
    // Check for login form
    cy.contains('h1', 'Login').should('be.visible');

    // Fill login form
    cy.get('input[placeholder="email"]').type('test@example.com');
    cy.get('input[placeholder="password"]').type('password');
    cy.contains('button', 'Login').click();

    // Wait for login request
    cy.wait('@login');

    // Should see My Notes
    cy.contains('h1', 'My Notes').should('be.visible');

    // Should see the note
    cy.contains('Test Note').should('be.visible');
  });
});
