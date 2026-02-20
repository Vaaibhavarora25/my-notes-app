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
