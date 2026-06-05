# AeroCode

## Sobre o Projeto

Projeto desenvolvido para a matéria de Programação orientada a objetos, atividade de avaliação 3.

O AeroCode é um sistema web para gerenciamento do processo de fabricação de aeronaves.

A aplicação permite controlar todas as etapas da produção, desde o cadastro da aeronave até a emissão do relatório final de aprovação.

### Funcionalidades

* Login e autenticação de usuários
* Controle de permissões(Administrador, engenheiro e operador)
* Cadastro de aeronaves
* Cadastro e gerenciamento de peças
* Controle das etapas de produção
* Registro de testes técnicos
* Emissão de relatórios finais
* Persistência de dados utilizando MySQL e Prisma ORM

### Tecnologias Utilizadas

**Frontend**
* React
* TypeScript
* React Router

**Backend**
* Node.js
* Express
* TypeScript

**Banco de Dados**
* MySQL
* Prisma ORM

**Testes de Carga**
* Autocannon

---

## Como Executar o Projeto

### Backend

Entrar na pasta do backend:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Criar um arquivo `.env` na pasta `backend` seguindo o modelo abaixo:

```env
DATABASE_URL="mysql://root:suasenha@localhost:3306/aerocode"
JWT_SECRET="chave_secreta"
PORT=3000
```

Substitua `suasenha` pela senha configurada no seu MySQL.

Após criar o arquivo `.env`, execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Executar o servidor:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

### Frontend

Entrar na pasta do frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

---

## Métricas de Desempenho

Para avaliar a qualidade do sistema foram realizados testes de carga utilizando a ferramenta **Autocannon**.

As métricas coletadas foram:

* **Latência:** tempo de comunicação entre cliente e servidor.
* **Tempo de Processamento:** tempo gasto pelo servidor para processar a requisição.
* **Tempo de Resposta:** tempo total percebido pelo usuário.

### Resultados

### Gráfico
<p align="center">
  <img src="img/graficodesempenho.png" width="900">
</p>

### Metodologia

A latência e o tempo de resposta foram obtidos através do Autocannon durante testes com 1, 5 e 10 usuários simultâneos.

O tempo de processamento foi medido por meio de um middleware implementado no backend, responsável por registrar o tempo gasto pelo servidor para processar cada requisição.

Os resultados demonstram que o sistema manteve estabilidade e baixo tempo de resposta mesmo com aumento da carga de usuários simultâneos.
