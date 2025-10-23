## Microblogging API - Projeto 2 EC48B

**Aluno:** Gabriel Borges
**RA:** 2269007
**Disciplina:** Programação Web Back-End - EC48B Turma C81

## Descrição
API de microblogging desenvolvida com Express.js e MongoDB para a disciplina de Programação Web Back-End. Sistema completo com autenticação por sessões, funcionalidades de publicação, comentários e interações entre usuários, implementado conforme requisitos do Projeto 2.

## Funcionalidades
- Sistema de autenticação com sessions
- CRUD completo de usuários, posts e comentários
- Sistema de likes em publicações
- Busca de posts por conteúdo
- Validação de campos obrigatórios
- Rotas protegidas para usuários autenticados
- Mensagens de erro
- Relacionamentos entre coleções do MongoDB

## Tecnologias Utilizadas
- Node.js
- Express.js (framework principal)
- MongoDB + Mongoose
- Express Session (autenticação)
- Crypto (nativo - hash de senhas)

## Instalação
npm install
Entrar na pasta src: cd src
node app.js

## Sistema de Autenticação
POST /api/auth/login
{
  "username": "usuario",
  "password": "senha"
}

POST /api/auth/logout
GET /api/auth/me

# Endpoints da API

## Health Check
GET /health

## Autenticação
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

## Usuários
POST /api/users
GET /api/users
GET /api/users/:id

## Posts (X = requer autenticação)
POST /api/posts           X
GET /api/posts
GET /api/posts/search?q=termo
POST /api/posts/:id/like  X
POST /api/posts/:id/unlike X

## Comentários (X = requer autenticação)
POST /api/comments        X
GET /api/comments/post/:postId

# Exemplos de Uso
## Criar Usuário
POST /api/users
{
  "username": "gabrielborges",
  "email": "gabriel.borges@email.com",
  "name": "Gabriel Borges",
  "password": "minhasenha",
  "bio": "Desenvolvedor Full Stack"
}

## Fazer Login
POST /api/auth/login
{
  "username": "gabrielborges",
  "password": "minhasenha"
}

## Criar Post (após login)
POST /api/posts
{
  "content": "Desenvolvendo projeto de microblogging para EC48B - Projeto 2",
  "tags": ["UTFPR", "NodeJS", "Express"]
}

## Buscar Posts
GET /api/posts/search?q=Express

## Curtir Post
POST /api/posts/ID_DO_POST/like

## Adicionar Comentário
POST /api/comments
{
  "content": "Excelente implementação com sistema de sessions!",
  "post": "ID_DO_POST"
}


Desenvolvido como Projeto 2 para EC48B - Programação Web Back-End
UTFPR - Universidade Tecnológica Federal do Paraná