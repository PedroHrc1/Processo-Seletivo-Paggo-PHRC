# Paggo OCR

Sistema de upload de faturas em PDF, extração de texto via OCR e chat interativo com LLM.

---

## 📋 Sumário

- [Descrição](#descrição)  
- [Pré-requisitos](#pré-requisitos)  
- [Estrutura do repositório](#estrutura-do-repositório)  
- [Variáveis de ambiente](#variáveis-de-ambiente)  
- [Infraestrutura (Docker)](#infraestrutura-docker)  
- [Backend](#backend)  
  - Instalação  
  - Migrations  
  - Execução  
  - Testes  
- [Frontend](#frontend)  
  - Instalação  
  - Execução  
  - Build  
- [Endpoints da API](#endpoints-da-api)  
- [Testes](#testes)  
- [Deploy](#deploy)  
- [Contato](#contato)  

---

## 📝 Descrição

Este projeto permite ao usuário:

1. **Registrar** e **logar** (JWT).  
2. **Enviar** arquivos PDF de faturas.  
3. **Extrair** texto via OCR (Tesseract + Poppler).  
4. **Interagir** com o conteúdo extraído usando uma LLM (Cohere).  

---

## 🔧 Pré-requisitos

- [Node.js ≥ 18.x](https://nodejs.org/)  
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)  
- [Docker & Docker Compose](https://www.docker.com/)  
- [Tesseract OCR](https://tesseract-ocr.github.io/) (ou via `choco install tesseract`)  
- [Poppler Utils](https://poppler.freedesktop.org/) (`pdftoppm`)  
- Variáveis de ambiente definidas (veja abaixo)  

---

## 📁 Estrutura do repositório


/
├── back/ # Backend NestJS
│ ├── prisma/ # Esquema e migrations do Prisma
│ ├── src/
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ ├── documents/
│ │ │ ├── ocr/
│ │ │ └── chat/
│ │ └── main.ts
│ └── .env
├── front/ # Frontend Next.js + Tailwind
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── context/
│ │ └── services/
│ └── .env.local
├── infra/ # Infraestrutura (Docker Compose)
│ └── docker-compose.yml
├── README.md
└── package.json # Raiz (scripts gerais)


---

## ⚙️ Variáveis de ambiente

### Backend (`back/.env`)

```dotenv
# Prisma
DATABASE_URL="postgresql://user:password@localhost:5432/paggo_ocr?schema=public"

# JWT
JWT_SECRET="seu_jwt_secret_super_secreto"

# Cohere
COHERE_API_KEY="seu_cohere_api_key"
```

## Frontend (front/.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## 🐳 Infraestrutura (Docker)
### No diretório infra/, rode:
```
docker-compose up -d
```
- Sobe container PostgreSQL
- Cria banco paggo_ocr
- Expõe porta 5432

# 🚀 Backend
## Instalação
```
cd back
npm install
```

Migrations
```
# Inicial
npx prisma migrate dev --name init

# Se adicionar coluna obrigatória sem default:
npx prisma migrate dev --create-only --name add_name_to_user
# Ajustar SQL manualmente e depois:
npx prisma migrate deploy
```

Execução em dev
```
npm run start:dev
```
A API estará em http://localhost:4000.

# 🌐 Frontend
## Instalação
```
cd front
npm install
```

Execução
``` 
npm run dev 
```
Acesse http://localhost:3000

# Build

```
npm run build
npm start
```

## Endpoints da API

| Método | Rota                             | Descrição                                    | Autenticação |
| ------ | -------------------------------- | -------------------------------------------- | ------------ |
| POST   | `/auth/register`                 | Cadastra um novo usuário                     | Não          |
| POST   | `/auth/login`                    | Autentica e retorna um JWT                   | Não          |
| POST   | `/documents`                     | Faz upload de um PDF e inicia OCR             | Sim          |
| GET    | `/documents`                     | Lista todos os documentos do usuário          | Sim          |
| GET    | `/documents/:id`                 | Retorna detalhes, texto extraído e interações | Sim          |
| POST   | `/documents/:id/interactions`    | Envia uma pergunta ao chat e recebe resposta  | Sim          |
