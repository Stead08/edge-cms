# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

use t-wada's TDD method to develop everything

## Key Development Commands

### Quick Start

```bash
pnpm dev              # Run all dev servers (admin UI + sandbox API)
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages (uses Biome)
pnpm format           # Format all packages (uses Biome)
pnpm type-check       # Type check all packages
```

### Testing

```bash
pnpm test             # Run all tests with Vitest
pnpm test:watch       # Run tests in watch mode
pnpm test <pattern>   # Run specific test files
```

### Database Operations (from apps/admin)

```bash
pnpm migrate:local    # Apply D1 migrations locally
pnpm migrate:remote   # Apply D1 migrations to production
pnpm reset:local      # Reset local D1 database
```

## Architecture Overview

This is an edge-native CMS built entirely on Cloudflare infrastructure. The system uses:

- **Cloudflare Workers** for compute
- **D1** for database (SQLite)
- **R2** for object storage
- **KV** for caching
- **Service bindings** for inter-service communication

### Package Structure

- `apps/admin`: React Router v7 SPA for the admin interface
- `apps/sandbox`: Hono API server that wraps the core functionality
- `packages/core`: Core CMS logic (collections, items, users, workspaces)
- `packages/auth`: Authentication layer using Lucia

### Key Architectural Patterns

1. **Type-Safe SQL**: Uses sqlc for generating TypeScript types from SQL queries. Query definitions are in `*.sql` files, generated code in `db/` directories.

2. **Service Bindings**: The admin app connects to the sandbox API through Cloudflare service bindings, not HTTP. See `apps/admin/app/lib/api/client.ts` for the implementation.

3. **JSON Schema Collections**: Content types are defined using JSON Schema stored in the database as JSONB. Field validation uses Zod schemas derived from these definitions.

4. **Multi-tenant Workspaces**: Each workspace has a unique slug and isolated data. Users can belong to multiple workspaces with different roles.

5. **Role-Based Access Control**: Three predefined roles (Viewer, Editor, Admin) with specific permissions checked at the API level.

## Important Conventions

### API Routes

All API routes are defined in `packages/core/src/routes/` and follow RESTful patterns:

- Collections: `/collections`
- Items: `/collections/:id/items`
- Users: `/users`
- Auth: `/auth/login`, `/auth/logout`, etc.

### Database Schema

- Primary keys use `TEXT` with ULIDs
- Timestamps use ISO 8601 format strings
- JSON data stored as `TEXT` (parsed in application)
- Soft deletes via `deleted_at` timestamp

### Error Handling

The codebase uses a consistent error pattern with `BaseError` class. API errors return structured JSON with status codes.

### Authentication

- Uses Lucia for session management
- Sessions stored in D1 with 30-day expiry
- Auth middleware validates sessions on protected routes

## Field Types

The CMS supports various field types defined in `packages/core/src/types/field-types.ts`:

- Basic: text, number, boolean, date, select
- Rich: markdown, mdx, json
- Media: image (with R2 storage)
- Relations: reference (to other items)

## Development Tips

1. **Local Development**: Run `pnpm dev` from the root to start both the admin UI and API. The admin UI proxies API requests through service bindings.

2. **Database Changes**: Add migrations in `packages/core/migrations/` with sequential numbering. Apply with `pnpm migrate:local` from the admin directory.

3. **Type Generation**: After modifying SQL queries, the types are auto-generated on build. Check `packages/core/src/db/` for generated types.

4. **Testing**: Tests use Vitest with Cloudflare Workers test pool for accurate edge environment simulation.

5. **Deployment**: The admin app deploys to Cloudflare Pages, the API to Workers. Use `pnpm deploy` from respective directories.
