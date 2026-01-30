# Acquisitions API

A production-ready Express.js REST API for user management and authentication, built with modern DevOps practices including Docker, CI/CD pipelines, and comprehensive testing.

## 🎯 Features

- **User Authentication**: JWT-based authentication with secure password hashing (bcrypt)
- **User Management**: Full CRUD operations for users with role-based access control
- **Security**: Helmet for HTTP headers, CORS protection, rate limiting with Arcjet, SQL injection prevention
- **Database**: Drizzle ORM with PostgreSQL via Neon
- **Validation**: Zod schema validation for type-safe request handling
- **Logging**: Winston logger with Morgan HTTP request logging
- **Testing**: Jest test suite with supertest for API testing
- **Code Quality**: ESLint and Prettier for code consistency
- **CI/CD**: GitHub Actions workflows for linting, testing, and Docker image builds
- **Docker**: Development and production Docker setups with health checks
- **Rate Limiting**: Dynamic rate limiting based on user roles

## 🛠 Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 5.2
- **Database**: PostgreSQL via Neon with Drizzle ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, Arcjet rate limiting
- **Logging**: Winston, Morgan
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker, Docker Compose

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose (for containerized setup)
- PostgreSQL database (Neon recommended)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaiChen22/acquisitions.git
   cd acquisitions
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file based on .env.example
   cp .env.example .env
   
   # Edit .env with your credentials
   nano .env
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Development with Docker

```bash
npm run dev:docker
```

This starts the application with Neon Local for development using ephemeral databases.

**Requirements:**
- Neon API Key (set in `.env`)
- Neon Project ID (set in `.env`)

### Production with Docker

```bash
docker-compose -f docker-compose.prod.yml up
```

For detailed Docker setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Sign Up
```http
POST /auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

#### Sign In
```http
POST /auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Returns JWT token in cookies.

#### Sign Out
```http
POST /auth/sign-out
```

### User Endpoints

#### Get All Users
```http
GET /users
```

**Response:**
```json
{
  "message": "Users fetched successfully",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2026-01-30T20:00:00.000Z",
      "updated_at": "2026-01-30T20:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get User by ID
```http
GET /users/:id
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newPassword123"
}
```

**Authorization Rules:**
- Users can only update their own information
- Only admins can change user roles

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

**Authorization Rules:**
- Users can only delete their own account
- Admins can delete any user

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-30T20:00:00.000Z",
  "uptime": 123.456
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Users sign up or sign in to receive a token
2. Token is stored in HTTP-only cookies
3. Include token in `Authorization: Bearer <token>` header for protected routes
4. Token expires after 1 day (configurable via `JWT_EXPIRES_IN`)

## 🛡️ Rate Limiting

Rate limits are applied per user role:
- **Admin**: 20 requests per minute
- **User**: 10 requests per minute
- **Guest**: 5 requests per minute

## 📝 Scripts

```bash
# Development
npm run dev              # Start development server with watch mode
npm run start           # Start production server

# Database
npm run db:generate    # Generate database migrations
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Drizzle Studio

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check Prettier formatting

# Testing
npm test               # Run Jest tests

# Docker
npm run dev:docker     # Run with Docker Compose (development)
```

## 📁 Project Structure

```
acquisitions/
├── src/
│   ├── app.js                 # Express app setup
│   ├── index.js               # Entry point
│   ├── server.js              # Server startup
│   ├── config/
│   │   ├── arcjet.js          # Arcjet security config
│   │   ├── database.js        # Database connection
│   │   └── logger.js          # Winston logger
│   ├── controllers/           # Request handlers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utilities (JWT, cookies, etc.)
│   ├── validations/           # Zod schemas
│   └── scripts/               # Utility scripts
├── test/                      # Test files
├── drizzle/                   # Database migrations
├── .github/workflows/         # GitHub Actions workflows
├── Dockerfile                 # Production Docker image
├── docker-compose.dev.yml    # Development Docker Compose
├── docker-compose.prod.yml   # Production Docker Compose
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions with three main workflows:

### 1. **Lint and Format** (`lint-and-format.yml`)
- Runs on push and PRs to `main` and `staging`
- Executes ESLint and Prettier checks
- Fails if code quality issues are found

### 2. **Tests** (`tests.yml`)
- Runs on push and PRs to `main` and `staging`
- Executes Jest test suite
- Uploads coverage reports as artifacts
- Generates test summary in GitHub

### 3. **Docker Build and Push** (`docker-build-and-push.yml`)
- Triggers on push to `main` or manual dispatch
- Builds multi-platform images (amd64, arm64)
- Pushes to Docker Hub
- Generates GitHub summary with image details

## 🌍 Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/database

# Neon (for development)
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
PARENT_BRANCH_ID=main

# JWT
JWT_SECRET=your_secret_key_here

# Logging
LOG_LEVEL=info

# Docker Hub (for CI/CD)
DOCKER_USERNAME=your_username
DOCKER_PASSWORD=your_token
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

With coverage report:

```bash
npm test -- --coverage
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check network connectivity to Neon
- Ensure database credentials are valid

### Docker Issues
- Rebuild images: `docker-compose build --no-cache`
- Check logs: `docker-compose logs -f`
- Ensure Docker daemon is running

## 📄 License

ISC License - see `package.json` for details

## 🤝 Contributing

1. Create a feature branch
2. Make changes and commit
3. Push to the branch
4. Create a Pull Request

All code must pass:
- ESLint checks (`npm run lint`)
- Prettier formatting (`npm run format`)
- Test suite (`npm test`)

## 📞 Support

For issues and questions:
- GitHub Issues: [https://github.com/SaiChen22/acquisitions/issues](https://github.com/SaiChen22/acquisitions/issues)
- Documentation: See [DOCKER_SETUP.md](DOCKER_SETUP.md) for advanced setup

## 🚀 Deployment

### Quick Start (Production)

1. Set production environment variables in `.env`
2. Run migrations: `npm run db:migrate`
3. Start server: `npm start`

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

For production deployment guide, see [DOCKER_SETUP.md](DOCKER_SETUP.md)
