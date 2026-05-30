# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Database management (Prisma)
npx prisma generate          # Generate Prisma client after schema changes
npx prisma migrate dev       # Create and apply migrations in development
npx prisma migrate deploy    # Apply migrations in production
npx prisma studio            # Open Prisma database GUI

# Start PostgreSQL (Docker)
docker-compose up -d
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Pino log level (defaults to 'info')

## Architecture

This is an Express 5 REST API with JWT authentication using ES modules.

### Request Flow
`server.js` → `app.js` → routes → middleware (validation/auth) → controller → service → Prisma

### Key Patterns

**Error Handling**: All errors extend `AppError` in `src/utils/error.js` with `isOperational` flag. Operational errors (validation, auth, not found) return structured JSON responses. Non-operational errors return 500. Controllers wrap service calls in try/catch and pass errors to `next()`.

**Validation**: Zod schemas in `src/schema/zodValidator.js` are applied via `validate()` middleware. Validated data is attached to `req.validatedData`.

**Authentication**: JWT tokens issued on login/register. Protected routes use `jwtValidator` middleware which attaches decoded payload to `req.user`.

**Routing**: Two routers in `src/routes/index.js`:
- `publicRouter` - unauthenticated endpoints (login, register)
- `privateRouter` - requires JWT via `jwtValidator` middleware

**Database**: Prisma with PostgreSQL via `@prisma/adapter-pg` connection pooling. The singleton client is exported from `src/utils/prisma.js`.
