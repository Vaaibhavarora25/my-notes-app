# My Notes App - Docker Setup Guide

This guide explains how to run the entire application stack (Frontend, Backend Microservices, API Gateway, Database) using Docker.

## Prerequisites

- **Docker Desktop**: Must be installed and running. [Download here](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Quick Start (Recommended)

We have created one-click setup scripts to make this easy.

### Windows
1. Open the project folder.
2. Double-click `setup.bat`.
3. Wait for the script to finish building and starting the containers.

### Linux / macOS
1. Open a terminal in the project folder.
2. Run the following commands:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

---

## ⚙️ Manual Setup

If you prefer to run commands manually:

1. **Create .env file**
   Copy the docker environment template to a new file named `.env`:
   ```bash
   cp .env.docker .env
   ```
   *(On Windows, just copy and rename `.env.docker` to `.env`)*

2. **Start Docker Containers**
   Run the following command to build and start everything in the background:
   ```bash
   docker compose up --build -d
   ```

3. **Check Status**
   Ensure all containers are running:
   ```bash
   docker compose ps
   ```

4. **View Logs**
   To see logs from all services:
   ```bash
   docker compose logs -f
   ```

---

## 🌍 Accessing the App

| Service | URL | Description |
|---|---|---|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | The main User Interface |
| **API Gateway** | [http://localhost:3001](http://localhost:3001) | Entry point for backend API |
| **Database** | `localhost:5432` | PostgreSQL Database |

**Default Credentials:**
- You can Sign Up with any email/password.
- Database User: `postgres`
- Database Password: `password123` (defined in `.env`)

---

## 🛑 Stopping the App

To stop all containers:
```bash
docker compose down
```

To stop and **remove volumes** (resets the database):
```bash
docker compose down -v
```

---

## Local Backend Setup (No Docker)

If you want to run backend services against your local PostgreSQL directly:

1. Ensure your root `.env` `DATABASE_URL` points to your local database.
2. Apply database schema to your local PostgreSQL:
   ```bash
   cd backend
   npm install
   npm run db:setup:local
   ```
3. Start services in separate terminals:
   ```bash
   npm run start:dev:users
   npm run start:dev:notes
   npm run start:dev:queue
   npm run start:dev
   ```

Swagger docs:
- `http://localhost:3001/docs`

`db:setup:local` pushes schema for both:
- `backend/apps/user-service/prisma/schema.prisma`
- `backend/apps/notes-service/prisma/schema.prisma`

If you also want to regenerate both Prisma clients, use:
```bash
npm run db:setup:local:fresh
```

### Run Everything with One Command

Use the root script:

```bash
bash run-all.sh
```

This script:
- generates Prisma clients
- syncs your local DB schema
- starts `user-service`, `notes-service`, `queue-service`, `api-gateway`, and frontend
- writes logs to `.logs/`
