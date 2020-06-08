declare const cy: { visit: (arg0: string) => void; contains: (arg0: string) => void };

it('loads examples', () => {
  const baseUrl = 'http://localhost:4200';
  cy.visit(baseUrl);
  // TODO
});
