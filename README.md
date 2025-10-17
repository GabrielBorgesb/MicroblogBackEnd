# Microblogging API - Projeto 1 EC48B - Recuperação

**Aluno:** Gabriel Borges
**RA:** 2269007
**Disciplina:** Programação Web Back-End - EC48B Turma C81

## Descrição
API de microblogging desenvolvida com Node.js nativo e MongoDB para a disciplina de Programação Web Back-End. Sistema completo com funcionalidades de publicação, comentários e interações entre usuários, implementado sem uso de frameworks.

## Funcionalidades
- CRUD completo de usuários, posts e comentários
- Sistema de likes em publicações
- Busca de posts por conteúdo
- Validação de dados integrada
- Tratamento de erros
- Relacionamentos entre coleções do MongoDB

## Tecnologias Utilizadas
- Node.js
- MongoDB + Mongoose
- JavaScript ES6+

## Instalação
# Instalar dependências
npm install

# Executar servidor
cd src
node server.js

# Endpoints da API

## Health Check
GET /health

## Usuários
POST /users
GET /users
GET /users/:id
DELETE /users/:id

## Posts
POST /posts
GET /posts
GET /posts/search?q=termo
POST /posts/:id/like
POST /posts/:id/unlike

## Comentários
POST /comments
GET /comments/post/:postId

# Exemplos de Uso
## Criar Usuário
POST /users
{
  "username": "gabrielborges",
  "email": "gabriel.borges@email.com", 
  "name": "Gabriel Borges",
  "bio": "Desenvolvedor Full Stack"
}

## Criar Post
POST /posts
{
  "content": "Desenvolvendo projeto de microblogging para EC48B - Recuperação",
  "author": "ID_DO_USUARIO",
  "tags": ["UTFPR", "NodeJS", "MongoDB"]
}

## Buscar Posts
GET /posts/search?q=NodeJS

## Curtir Post
POST /posts/ID_DO_POST/like
{
  "userId": "ID_DO_USUARIO"
}

## Adicionar Comentário
POST /comments
{
  "content": "Excelente implementação com Node.js puro!",
  "author": "ID_DO_USUARIO", 
  "post": "ID_DO_POST"
}

# Estrutura do Projeto
src/
models/ (User, Post, Comment)
server.js

