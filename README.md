# Z1 E-commerce API

A modern e-commerce API built with Bun, Hono, TypeScript, and Clean Architecture principles. Features include user management, product catalog, and order processing with proper inventory control.

## 🏗️ Architecture

This project follows Clean Architecture principles with a clear separation of concerns:

```
src/
├── application/        # Application business rules
│   ├── routes/        # API routes and controllers
│   └── use-cases/     # Use cases implementation
│       ├── orders/
│       ├── products/
│       └── users/
├── domain/            # Enterprise business rules
│   ├── entities/      # Business entities
│   ├── repositories/  # Repository interfaces
│   ├── utils/        # Shared utilities
│   └── validations/  # Schema validations
└── infrastructure/    # Frameworks and drivers
    ├── container/     # Dependency injection setup
    ├── database/      # Database configurations
    │   └── schema/    # Database schemas
    └── repositories/  # Repository implementations
```

## 🚀 Features

- **Clean Architecture**: Clear separation of concerns and dependencies pointing inward
- **Type Safety**: Full TypeScript support with proper type definitions
- **API Documentation**: OpenAPI/Swagger documentation
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis integration
- **Dependency Injection**: Using TSyringe
- **Error Handling**: Consistent error handling with Result type
- **Validation**: Request validation with Zod
- **Docker Support**: Containerization with multi-stage builds

## 🛠️ Technologies

- Bun
- TypeScript
- Hono
- Drizzle ORM
- PostgreSQL
- Redis
- TSyringe
- Zod
- Docker

## 🏃‍♂️ Running the Project

### Local Development

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Start Redis (required):
```bash
docker compose up redis -d
```

4. Run the development server:
```bash
bun run dev
```

5. Access the API:
- API: http://localhost:3000
- Documentation: http://localhost:3000/ui

### Using Docker

1. Build and start all services:
```bash
docker compose up -d
```

2. Stop all services:
```bash
docker compose down
```

## 📚 API Documentation

The API documentation is available at `/ui` when the server is running. It includes:

- All available endpoints
- Request/response schemas
- Example requests

## 🧪 Testing

Run the test suite:
```bash
bun test
```

## 📝 License

MIT
