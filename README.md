# 💠 Pix - Frontend

Este projeto é a interface frontend para um sistema de simulação de transferências Pix, desenvolvido como parte do Trabalho Prático da disciplina de Tópicos Especias para Desenvolvimento de Software.

O sistema permite que usuários visualizem chaves Pix, realizem transferências instantâneas, visualizem extratos bancários e gerenciem seus perfis.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias modernas:

* Next: Framework React para produção.

* React: Biblioteca para construção de interfaces.

* TypeScript: Tipagem estática para maior segurança e produtividade.
 
* Tailwind CSS: Estilização utilitária para design responsivo e ágil.
 
* Lucide React: Biblioteca de ícones leve e moderna.
 
* Zod + React Hook Form: Validação de esquemas e manipulação de formulários.
 
* Cypress: Testes End-to-End (E2E) automatizados.

## ✨ Funcionalidades

### 🔓 Área Pública

Home / Discovery: Consulta pública de chaves Pix por CPF/CNPJ para verificar a existência de usuários.

Login: Autenticação segura com JWT (armazenado via Cookies HttpOnly pelo backend).

### 🔒 Área Logada (Protegida via Middleware)

* **Dashboard / Extrato**:
    * Visualização de entradas e saídas.
    * Paginação de transações.
    * Filtros visuais por data.
    * Identificação visual de Crédito (Verde) e Débito (Vermelho).

* **Área Pix**:
    * Realização de transferências instantâneas.
    * Máscara de moeda (R$) automática.
    * Validação de saldo e chaves.
    * Seleção inteligente de chave de origem.

* **Minhas Chaves**:
    * Listagem de chaves cadastradas.
    * Criação de novas chaves (Aleatória, CPF, Email, * Telefone).
    * Exclusão de chaves.    
    * Botão de "Copiar" para área de transferência.

* **Perfil**:
    * Visualização de dados cadastrais.
    * Logout seguro (limpeza de cookies e cache).

## 🛠️ Instalação e Execução

**Pré-requisitos**
* Node.js (v18 ou superior)
* NPM ou Yarn

**Passos**

1. Clone o repositório:

```shell
git clone [https://github.com/seu-usuario/pix-frontend-next.git](https://github.com/seu-usuario/pix-frontend-next.git)
cd pix-frontend-next
```

2. Instale as dependências:
```shell
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente (se necessário):


4. Rode o servidor de desenvolvimento:
```shell
npm run dev
```

5. Acesse http://localhost:3000 no seu navegador.

## 🧪 Testes E2E (Cypress)

O projeto possui testes automatizados configurados para garantir a qualidade das funcionalidades críticas (como exclusão de chaves).

**Configuração Especial**


**Rodando os Testes**

Para abrir a interface visual do Cypress:
```shell
npx cypress open
```

Selecione `E2E Testing` > `Chrome`.


## 📂 Estrutura de Pastas
```
src/
├── app/                 # Rotas do Next.js (App Router)
│   ├── login/           # Página de Login
│   ├── extrato/         # Página de Extrato Bancário
│   ├── chaves/          # Gestão de Chaves Pix
│   ├── transacoes/      # Fluxo de envio de Pix
│   ├── perfil/          # Perfil do Usuário
│   └── page.tsx         # Home Pública
├── components/          # Componentes Reutilizáveis
├── functions/           # Funções utilitárias (Logout, GetPayload)
├── services/            # Configuração do Axios (API)
├── Model/               # Tipagens e Schemas Zod
└── middleware.ts        # Proteção de Rotas
cypress/                 # Testes E2E
```

## 👥 Equipe

Projeto desenvolvido por Eduardo dos Santos de Camargo. O backend foi desenvolvido em coperação com Vitória Aparecida dos Santos.

### Vídeo da Apresentação
[Clique aqui](https://youtu.be/t9gYc0aEl0E)

[Clique aqui se não der](https://drive.google.com/file/d/1eA7xy9X2R1ZKjB37Pr3Onfo1Fn8RRpUQ/view?usp=sharing)