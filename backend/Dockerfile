# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies required for Prisma
RUN apk add --no-cache openssl libc6-compat


# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build all applications
RUN npx nest build api-gateway
RUN npx nest build user-service
RUN npx nest build notes-service

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install dependencies required for Prisma
RUN apk add --no-cache openssl libc6-compat


# Copy necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Expose ports for documentation (actual exposure happens in docker-compose)
EXPOSE 3000 3001 3002

# The CMD is overridden by docker-compose for each service
CMD ["node", "dist/apps/api-gateway/main"]
