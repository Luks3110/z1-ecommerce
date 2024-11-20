# Z1 E-commerce API

A modern e-commerce API built with Bun, Hono, TypeScript, and Clean Architecture principles.

## 🚀 Features

- Clean Architecture
- TypeScript
- OpenAPI/Swagger documentation
- PostgreSQL with Drizzle ORM
- Redis for caching
- Docker support
- Dependency Injection
- Error handling with Result type
- Request validation with Zod

## 🏃‍♂️ Running the Project

### Prerequisites

- Docker and Docker Compose
- Bun (for local development)

### Using Docker (Recommended)

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Start all services:
```bash
docker compose up -d
```

3. Run database migrations:
```bash
docker compose exec api bun run db:migrate
```

4. Access the API:
- API: http://localhost:3000
- Documentation: http://localhost:3000/ui

### Local Development

1. Install dependencies:
```bash
bun install
```

2. Start PostgreSQL and Redis:
```bash
docker compose up postgres redis -d
```

3. Run database migrations:
```bash
bun run db:migrate
```

4. Start the development server:
```bash
bun run dev
```

## 📚 Database Migrations

Generate migrations:
```bash
bun run db:generate
```

Apply migrations:
```bash
bun run db:migrate
```

Push migrations to the database:
```bash
bun run db:push
```

## 🧪 Testing

Run tests:
```bash
bun test
```

## Postman Collection

Access the /docs endpoint, copy the Open Api schema and import it into Postman or any other API client.

## 📝 License

MIT
