#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up My Notes App...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

# Setup .env if not exists
if [ ! -f .env ]; then
  echo -e "${BLUE}📝 Creating .env file from safe defaults...${NC}"
  cp .env.docker .env
else
  echo "✅ .env file already exists."
fi

# Build and start containers
echo -e "${BLUE}🐳 Building and starting containers...${NC}"
docker compose up --build -d

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "-------------------------------------------"
echo -e "🌍 Frontend:   http://localhost:3000"
echo -e "🔌 API Gateway: http://localhost:3001"
echo -e "-------------------------------------------"
echo -e "Use 'docker compose logs -f' to view logs."
