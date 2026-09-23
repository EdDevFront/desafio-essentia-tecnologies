# 🚀 TechX - Task Management System

Aplicação web fullstack de gerenciamento de tarefas desenvolvida para a **TechX**, combinando **Angular 19**, **NestJS**, **Tailwind CSS v4**, **MongoDB Atlas (Mongoose)**, **JWT Authentication** e **Swagger API Documentation**.

> **Desenvolvedor:** Edmilson Motta (<edd.contato@gmail.com>)

---

## 📌 Variáveis de Ambiente (.env) & Instruções de Avaliação

> [!IMPORTANT]
> **Credenciais de Acesso (.env)**:
> As variáveis de ambiente com as credenciais do banco de dados na nuvem (**MongoDB Atlas**) e chaves da aplicação foram **enviadas diretamente para a recrutadora** do processo seletivo.
> 
> Para rodar o backend localmente, crie o arquivo `backend/.env` inserindo as variáveis enviadas (ou utilizando a estrutura presente em `backend/.env.example`).

---

## ⚡ Como Executar o Projeto Localmente

O projeto já está **100% pronto para testar**. Basta executar o backend e o frontend localmente:

### Pré-requisitos
- Node.js (v20+) & npm
- Git

---

### 1. Executar o Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
- **API Server:** `http://localhost:3000`
- **Swagger Docs:** `http://localhost:3000/api/docs`

---

### 2. Executar o Frontend (Angular 19)
```bash
cd frontend
npm install
npm run start
```
- **Interface Web:** `http://localhost:4200`

---

## 📂 Estrutura & Organização do Monorepo

O projeto está organizado em um monorepo modular, separando com clareza a aplicação **Backend** (NestJS 10) e **Frontend** (Angular 19), seguindo os princípios de Domain-Driven Design (DDD), Clean Architecture e DRY (Don't Repeat Yourself):

```text
desafio-essentia-tecnologies/
├── backend/                  # Aplicação Backend (NestJS 10 API RESTful)
│   ├── src/
│   │   ├── core/             # Banco de Dados (Mongoose), Guards (JWT), Interceptors e Estratégias
│   │   └── modules/
│   │       ├── auth/         # Domínio de Autenticação (Controller, Service, Schema User, DTOs)
│   │       └── tasks/        # Domínio de Tarefas (Controller, Service, Schema Task, DTOs)
│   └── test/                 # Testes Automatizados (E2E e Unitários)
│
└── frontend/                 # Aplicação Frontend (Angular 19 - Standalone Components)
    └── src/
        └── app/
            ├── core/         # Serviços Globais (Auth, Task, Toast), Interceptors, Guards e Models
            ├── features/     # Módulos de Funcionalidades (Login, Register, Task Dashboard, Modais)
            └── shared/       # Componentes de UI Reutilizáveis (Button, Input, Select, Datepicker, Modal, Pipes)
```

---

## 🏗️ Princípios de Arquitetura & Qualidade de Código
- **Clean Architecture & DDD:** Separação limpa em módulos de domínio (Auth, Tasks), DTOs, Schemas Mongoose, Serviços e Controladores.
- **SOLID / KISS / DRY:** Código modular, desacoplado e reutilizável.
- **Restrições Estritas de Código:**
  - Máximo de **200 linhas por arquivo**.
  - Máximo de **20 linhas por função/método**.
- **Commits Atômicos:** Todo o repositório foi construído com Conventional Commits atômicos por Edmilson Motta.

---

## 📝 Documentação da API (Swagger)
Acesse a documentação interativa Swagger para testar todos os endpoints RESTful:
👉 `http://localhost:3000/api/docs`

### Endpoints Principais:
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Autenticação e geração de JWT
- `GET /api/auth/profile` - Obter dados do perfil do usuário autenticado
- `GET /api/tasks` - Listagem com busca e filtros (Status, Prioridade, Categoria)
- `POST /api/tasks` - Criação de tarefas
- `PATCH /api/tasks/:id` - Atualização parcial de tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar conclusão de tarefa
- `DELETE /api/tasks/:id` - Exclusão de tarefa
