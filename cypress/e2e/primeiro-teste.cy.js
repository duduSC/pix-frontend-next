
describe("Página inicial",()=>{
    it("Deve exibir o corretamente",()=>{
        cy.visit("localhost:3000/users");
        cy.contains('CPF')
    })
})