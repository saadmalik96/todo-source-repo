describe('Todo Integration Test', () => {
  it('adds a todo and verifies it in the backend', () => {
    const todoText = 'Integration Test Todo';

    // Visit the frontend
    cy.visit('/');

    // Type the todo and click "Add"
    cy.get('input[placeholder="New Task"]').type(todoText);
    cy.contains('Add').click();

    // Wait briefly for the API call to complete
    cy.wait(1000);

    // Verify the new todo appears in the UI
    cy.contains(todoText).should('exist');

    // Also request the backend API directly to verify the todo was added
    cy.request('http://localhost/api/todos')
      .its('body')
      .then((todos) => {
        const addedTodo = todos.find(todo => todo.task === todoText);
        expect(addedTodo).to.exist;
        expect(addedTodo.completed).to.be.oneOf([false, 0]);
      });
  });
});
