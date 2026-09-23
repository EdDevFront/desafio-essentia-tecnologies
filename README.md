# 🚀 TechX - Task Management System

Aplicação web fullstack de gerenciamento de tarefas desenvolvida para a **TechX**, combinando **Angular 19**, **NestJS**, **Tailwind CSS v4**, **MongoDB Atlas (Mongoose)**, **JWT Authentication** e **Swagger API Documentation**.

> **Desenvolvedor:** Edmilson Motta (<edd.contato@gmail.com>)

---

## 📌 Integração MongoDB Atlas & Instruções de Avaliação

> [!IMPORTANT]
> **Banco de Dados na Nuvem Integrado (MongoDB Atlas)**:
> O banco de dados da aplicação foi integrado com o **MongoDB Atlas**. Para permitir que os avaliadores do processo seletivo testem a aplicação **imediatamente sem qualquer complicação ou configuração extra de banco local**, o arquivo `backend/.env` contendo as credenciais de conexão do cluster foi **temporariamente mantido no repositório Git**.
> 
> *Nota de Segurança:* Assim que o resultado do processo seletivo for concluído, este cluster e a credencial do `.env` serão permanentemente excluídos/revogados.

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

## 🎨 Design System & Identidade Visual (TechX)
A interface do usuário foi inspirada no ecossistema visual de **Essentia Technologies**, trazendo uma experiência moderna e consistente:
- **Tema:** Dark Mode ultra-clean (`#050505` / `#161b22`).
- **Gradients & Accents:** Tons dourados/âmbar (`#FBB03B` / `#DC8016`) com toques em verde esmeralda (`#10B981`).
- **Favicon Personalizado:** Ícone "X" em degradê dourado idêntico à logo da aplicação no navegador.
- **Componentes Customizados:**
  - `SelectComponent`: Dropdown de seleção personalizado com scrollbar dourada e suporte a ControlValueAccessor.
  - `DatepickerComponent`: Seletor de datas com fundo 100% sólido e navegação por calendário.
  - `TaskDetailModalComponent`: Modal de visualização detalhada ao clicar em qualquer cartão de tarefa.
  - `ConfirmModalComponent`: Modal de confirmação para exclusão de tarefas.
  - Cartões de tarefa com alinhamento e dimensões perfeitamente uniformes.

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
