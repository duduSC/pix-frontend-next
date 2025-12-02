// Import commands.js using ES2015 syntax:
import './commands';

// --- CONFIGURAÇÃO DE VELOCIDADE ---
// Altere este valor para definir quanto tempo (ms) o Cypress espera entre ações
// 0 = Velocidade normal (sem atraso)
// 1000 = 1 segundo de atraso
const COMMAND_DELAY = 1000; 

if (COMMAND_DELAY > 0) {
  // Removi 'contains' e 'get' pois são Queries no Cypress 12+ e geram erro ao usar overwrite
  // Atrasar as ações abaixo já é suficiente para o efeito visual
  const commandsToDelay = ['visit', 'click', 'trigger', 'type', 'clear', 'reload'];

  commandsToDelay.forEach((command) => {
    Cypress.Commands.overwrite(command as any, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  });
}