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

Popular o banco de dados:

```bash
npm run seed
```

Executar o servidor:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

```markdown
### Usuários Padrão

Após executar a seed, os seguintes usuários estarão disponíveis:

| Perfil | Usuário | Senha |
|----------|----------|----------|
| Administrador | admin | admin123 |
| Engenheiro | engenheiro | eng123 |
| Operador | operador | op123 |

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

| Usuários Simultâneos | Latência (ms) | Processamento (ms) | Resposta (ms) |
|---------------------|---------------|-------------------|---------------|
| 1 | 1.32 | 2.38 | 3.70 |
| 5 | 5.63 | 7.54 | 13.17 |
| 10 | 12.40 | 14.33 | 26.73 |

### Gráfico
<p align="center">
  <img src="img/graficodesempenho.png" width="900">
</p>
Observa-se que o aumento do número de usuários simultâneos provoca crescimento gradual da latência, do tempo de processamento e do tempo de resposta. Mesmo com 10 usuários simultâneos, os tempos permaneceram abaixo de 30 ms.

### Metodologia

Os testes foram realizados utilizando a ferramenta Autocannon, responsável por simular múltiplos usuários acessando simultaneamente a rota principal da aplicação.

Foram executados três cenários:

- 1 usuário simultâneo
- 5 usuários simultâneos
- 10 usuários simultâneos

A latência e o tempo de resposta foram obtidos diretamente dos resultados produzidos pelo Autocannon.

Para medir o tempo de processamento, foi desenvolvido um middleware personalizado no backend que registra o instante de início e término de cada requisição, calculando o tempo gasto pelo servidor para processar a operação.

Os dados coletados foram armazenados em arquivos de log e posteriormente utilizados para gerar os gráficos apresentados neste relatório.
