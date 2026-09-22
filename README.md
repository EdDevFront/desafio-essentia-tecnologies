# 🚀 TechX - Task Management System

Aplicação web fullstack de gerenciamento de tarefas desenvolvida para a **TechX**, combinando **Angular 19**, **NestJS**, **Tailwind CSS v4**, **TypeORM (MySQL/SQLite)**, **JWT Authentication** e **Swagger API Documentation**.

> **Desenvolvedor:** Edmilson Motta (<edd.contato@gmail.com>)

---

## 🎨 Design System & Identidade Visual
A interface do usuário foi inspirada no ecossistema visual de **Essentia Technologies**, trazendo uma experiência moderna:
- **Tema:** Dark Mode ultra-clean (`#050505` / `#0d1117`).
- **Gradients & Accents:** Tons dourados/âmbar (`#FBB03B` / `#DC8016`) com toques cibernéticos em verde esmeralda (`#10B981`).
- **Elementos:** Cards com Glassmorphism, botões de pill arredondados e micro-animações.

---

## 🏗️ Princípios de Arquitetura & Qualidade de Código
- **Clean Architecture & DDD:** Separação limpa em módulos de domínio (Auth, Tasks), DTOs, Entidades, Serviços e Controladores.
- **SOLID / KISS / DRY:** Código modular e desacoplado.
- **Restrições Estritas de Código:**
  - Máximo de **200 linhas por arquivo**.
  - Máximo de **20 linhas por função/método**.
- **Commits Atômicos:** Todo o repositório foi construído com Conventional Commits atômicos por feature.

---

## ⚡ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v20+) & npm
- Git
- Docker & Docker Compose *(opcional para banco MySQL)*

---

### 1. Iniciar o Banco de Dados (MySQL via Docker)
Se desejar utilizar o MySQL via Docker:
```bash
docker-compose up -d
```
> *Nota: O backend possui fallback automático para **SQLite** caso o MySQL não esteja rodando.*

---

### 2. Executar o Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
- **API Server:** `http://localhost:3000`
- **Swagger Docs:** `http://localhost:3000/api/docs`

---

### 3. Executar o Frontend (Angular 19)
```bash
cd frontend
npm install
npm run start
```
- **Interface Web:** `http://localhost:4200`

---

## 📝 Documentação da API (Swagger)
Acesse a documentação interativa Swagger para testar todos os endpoints RESTful:
👉 `http://localhost:3000/api/docs`

### Endpoints Principais:
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Autenticação e geração de JWT
- `GET /api/tasks` - Listagem com busca e filtros (Status, Prioridade)
- `POST /api/tasks` - Criação de tarefas
- `PATCH /api/tasks/:id` - Atualização parcial
- `PATCH /api/tasks/:id/toggle` - Alternar conclusão
- `DELETE /api/tasks/:id` - Exclusão de tarefa
