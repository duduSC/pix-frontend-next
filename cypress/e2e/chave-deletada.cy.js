describe('Funcionalidade de Exclusão de Chaves Pix', () => {
  const chaveParaDeletar = 'chave-aleatoria-teste-123';
  const outraChave = 'email@teste.com';

  beforeEach(() => {
    cy.setCookie('token', 'fake-jwt-token');

    cy.intercept('GET', '**/autenticacao/me', {
      statusCode: 200,
      body: {
        id: 1,
        nome: 'Usuário Teste',
        email: 'teste@email.com'
      }
    }).as('getUserData');

    cy.intercept('GET', '**/usuarios/1/chaves', {
      statusCode: 200,
      body: [
        { chave: outraChave, tipo: 'E' },
        { chave: chaveParaDeletar, tipo: 'A' }
      ]
    }).as('getChaves');

    cy.intercept('DELETE', `**/chaves/${chaveParaDeletar}`, {
      statusCode: 200,
      body: { message: 'Chave deletada com sucesso' }
    }).as('deleteRequest');
  });

  it('Deve remover a chave da lista visualmente após exclusão bem-sucedida', () => {
    cy.visit('/chaves');

    cy.wait('@getUserData');
    cy.wait('@getChaves');

    cy.contains(chaveParaDeletar).should('be.visible');
    cy.contains(outraChave).should('be.visible');

    cy.contains(chaveParaDeletar)
      .parents('.bg-white') 
      .find('button[title="Excluir chave"]')
      .click();

    cy.wait('@deleteRequest');

    cy.contains(chaveParaDeletar).should('not.exist');

    cy.contains(outraChave).should('be.visible');
  });
});