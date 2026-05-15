# Sistema de Orçamento Metalúrgico - CCM

Este projeto é uma aplicação Full Stack desenvolvida para o cálculo técnico de orçamentos metalúrgicos (Volume, Peso e Usinagem), utilizando uma arquitetura robusta e persistência de dados em banco de dados relacional.

## Tecnologias Utilizadas

**Front-end:** HTML5, CSS, JavaScript (Fetch API)
**Back-end:** Node.js, Express.js
**Banco de Dados:** MySQL
**Segurança/Comunicação:** CORS, Dotenv

## Arquitetura e Padrões de Projeto

O projeto foi estruturado seguindo padrões de mercado para garantir escalabilidade e organização:

**Arquitetura MVC (Model-View-Controller):** Separamos a lógica de negócio (Model), a interface do usuário (View) e o controle de rotas (Controller) em camadas distintas para facilitar a manutenção e testes.
**Factory Method:** Implementamos o método static criar na classe Orcamento. Isso permite que os dados sejam validados rigorosamente antes da criação do objeto, garantindo a integridade da informação.
**Repository Pattern:** Criamos uma camada de repositório para isolar o acesso ao banco de dados, tornando o código do Controller mais limpo e focado na regra de negócio.
**Persistência de Dados:** Diferente de uma aplicação estática, os dados são enviados via JSON para uma API e salvos permanentemente no MySQL.
**CORS:** Implementamos o middleware CORS para permitir a comunicação segura entre o Front-end e a API em diferentes origens (localhost).
Design Pattern Singleton (Database): Implementamos a conexão com o banco de dados utilizando Singleton para garantir uma única instância do Pool de conexões, otimizando o consumo de memória e a performance do servidor.


## Estrutura de Pastas

text
/src
├── /configs       # Conexão com o banco de dados (Database.js)
├── /controllers   # Lógica de controle e resposta das requisições
├── /models        # Classes, regras de negócio e Factory Methods
├── /repositories  # Comandos SQL e acesso direto ao banco
├── /routes        # Definição das rotas da API
├── index.html     # Interface principal
├── script.js      # Lógica de interação e cálculos do front-end
├── styles.css     # Estilização da interface
└── server.js      # Ponto de entrada do servidor Back-end
