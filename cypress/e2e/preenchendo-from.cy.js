describe("Formulario de contato", () => {
    it("Deve preencher e enviar o formulario", () => {
        cy.visit("localhost:3000/users");
        cy.get('input[name="nome"]').type("Maria Silva");
        cy.get('input[name="password"]').type("maria@email.com");
        cy.get('button[type="submit"]').click();
    });
});
