@echo off
setlocal

echo 🚀 Setting up My Notes App...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

REM Setup .env if not exists
if not exist .env (
    echo 📝 Creating .env file from safe defaults...
    copy .env.docker .env >nul
) else (
    echo ✅ .env file already exists.
)

REM Build and start containers
echo 🐳 Building and starting containers...
docker compose up --build -d

echo.
echo ✅ Setup complete!
echo -------------------------------------------
echo 🌍 Frontend:   http://localhost:3000
echo 🔌 API Gateway: http://localhost:3001
echo -------------------------------------------
echo Use 'docker compose logs -f' to view logs.
pause

endlocal
