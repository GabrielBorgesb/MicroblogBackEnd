# Microblogging API - Projeto 1 EC48B

**Aluno:** Gabriel Borges
**RA:** 2269007
**Disciplina:** Programação Web Back-End - EC48B Turma C81

## Descrição
API de microblogging desenvolvida com Node.js, Express e MongoDB para a disciplina de Programação Web Back-End. Sistema com funcionalidades de publicação, comentários e interações entre usuários.

## Funcionalidades
- CRUD completo de usuários, posts e comentários
- Sistema de likes em publicações
- Busca de posts por conteúdo
- Validação de dados com Joi
- Tratamento de erros e logging em arquivos
- Relacionamentos entre coleções do MongoDB

## Tecnologias Utilizadas
- Node.js
- Express.js
- MongoDB + Mongoose
- Joi (validação)
- Winston (logging)

## Instalação
npm install
npm run dev

# Endpoints da API

## Health Check
GET /health

## Usuários
POST /api/users
GET /api/users
GET /api/users/:id

## Posts
POST /api/posts
GET /api/posts
GET /api/posts/search/:term
POST /api/posts/:id/like
POST /api/posts/:id/unlike

## Comentários
POST /api/comments
GET /api/comments/post/:postId

# Exemplos de Uso
## Criar Usuário
POST /api/users
{
"username": "gabrielborges",
"email": "gabriel.borges@email.com",
"name": "Gabriel Borges",
"bio": "Desenvolvedor Full Stack"
}

## Criar Post
POST /api/posts
{
"content": "Desenvolvendo projeto de microblogging para EC48B",
"author": "ID_DO_USUARIO",
"tags": ["UTFPR", "NodeJS"]
}

## Buscar Posts
GET /api/posts/search/NodeJS

## Curtir Post
POST /api/posts/ID_DO_POST/like
{
"userId": "ID_DO_USUARIO"
}

## Adicionar Comentário
POST /api/comments
{
"content": "Excelente implementação",
"author": "ID_DO_USUARIO",
"post": "ID_DO_POST"
}

# Estrutura do Projeto
src/
models/ (User, Post, Comment)
repositories/ (UserRepository, PostRepository, CommentRepository)
routes/ (users, posts, comments)
middlewares/ (validation, errorHandler)
utils/ (logger, validators)
app.js

