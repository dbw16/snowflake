# Snowflake - Engineering Growth Framework

A modern, database-driven web application for tracking and supporting engineers' career development. This is a comprehensive fork and modernization of [Medium's original Snowflake tool](https://github.com/Medium/snowflake), rebuilt with Next.js 15, TypeScript, and SQLite.

## 🚀 Overview

Snowflake helps engineering organizations implement structured career development by providing:

- **16 Career Tracks** across technical and leadership skills
- **5 Milestone Levels** for each track with clear progression criteria
- **Interactive Visualizations** including the signature "snowflake" chart
- **Comments & Collaboration** on specific skills and milestones
- **Admin Dashboard** for user and access management
- **Authentication** with Azure AD integration for enterprise use

## 🏗️ Architecture

This modernized version features:

- **Next.js 15** with App Router and React 19
- **SQLite Database** with Drizzle ORM for data persistence
- **TypeScript** for full type safety
- **NextAuth.js** for authentication (Azure AD + dev credentials)
- **Comprehensive Testing** with Vitest and Playwright
- **Modern Tooling** (ESLint 9, Prettier, Hot Reload)

## 📋 Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn**
- **SQLite** (included with Node.js)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dbw16/snowflake.git
   cd snowflake
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # For production (Azure AD)
   AZURE_AD_CLIENT_ID=your-azure-ad-client-id
   AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
   AZURE_AD_TENANT_ID=your-azure-ad-tenant-id
   
   # NextAuth configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-here
   ```

4. **Initialize the database (automatic in dev)**:
   By default (when `NODE_ENV=development`) the app will auto-run migrations on startup using `instrumentation.ts`. Just run the dev server (next step) and the database + tables will be created if they don't exist.

   If you prefer to initialize manually or you're in production:
   ```bash
   npm run drizzle:push   # Creates tables to match current schema (development convenience)
   # OR (recommended for production / CI controlled changes)
   npm run drizzle:migrate
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Visit the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚦 Getting Started

### Development Mode
In development, you can sign in with any username using the credentials provider. Simply enter a username (e.g., "dev") to get started.

### Production Mode
In production, the app uses Azure AD authentication. Users will be redirected to your organization's Azure AD login.

### First Admin Setup
To set up your first admin user, use the initialization API:
```bash
curl -X POST http://localhost:3000/api/init-admin \
  -H "Content-Type: application/json" \
  -d '{"username": "your-username"}'
```

## 📊 Features

### Career Development Tracks

The framework includes 16 professional development tracks organized into 4 categories:

**Category A - Technical Skills:**
- Mobile Development
- Web Client Development  
- Foundations
- Servers

**Category B - Execution:**
- Project Management
- Communication
- Craft
- Initiative

**Category C - Supporting Others:**
- Career Development
- Org Design
- Wellbeing
- Accomplishment

**Category D - Community:**
- Mentorship
- Evangelism
- Recruiting
- Community

### Milestone System

Each track has 5 milestone levels:
- **Level 1** (1 point): Foundational skills
- **Level 2** (3 points): Developing competency
- **Level 3** (6 points): Solid expertise
- **Level 4** (12 points): Advanced mastery
- **Level 5** (20 points): Expert/leadership level

### Visualizations

- **Snowflake Chart**: Radar chart showing skill distribution
- **Level Thermometer**: Progress toward next career level
- **Point Summaries**: Total points and level calculations

### Collaboration Features

- **Comments**: Add comments on specific skills and milestones
- **Threaded Discussions**: Reply to comments for detailed conversations
- **Archive System**: Archive outdated or completed milestones

### Admin Dashboard

Admins can:
- Manage user accounts and permissions
- Grant/revoke admin access
- View all user reports
- Monitor system usage

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run drizzle:generate  # Generate migrations
npm run drizzle:migrate   # Run migrations
npm run drizzle:push      # Push schema to database

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run typecheck    # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
```

### Database Schema & Startup

The application uses a simplified database schema handled by **Drizzle ORM** migrations. On server startup we ensure the schema exists.

- **users**: User accounts (username as primary key)
- **user_roles**: Role assignments (admin, user, etc.)
- **comments**: Comments on milestones and signals
- **archived**: Archived tracks and milestones
- **report_milestones**: User milestone progress

Each user implicitly owns one report with their username as the key.

#### Automatic Database Initialization

We leverage Next.js `instrumentation.ts` to run once at server start and execute any pending migrations. Behavior is controlled via environment variables:

| Variable | Values | Default | Meaning |
|----------|--------|---------|---------|
| `DB_AUTO_MIGRATE` | `true` / `false` | (dev: `true`, prod: `false`) | Run migrations automatically on startup |
| `DATABASE_PATH` | path | `data/app.sqlite3` | SQLite file location |
| `DB_MIGRATIONS_DIR` | path | `./drizzle` | Folder containing Drizzle migration files |

In development you get auto-migrations without extra steps. In production you should typically run migrations in CI/CD before starting the app (see below) and keep `DB_AUTO_MIGRATE=false` to avoid write conflicts or cold start latency.

#### Manual / CI Migration Workflow

Recommended production sequence:
1. Generate migration(s) from schema changes: `npm run drizzle:generate`
2. Commit the generated SQL under `drizzle/`
3. Apply migrations during deployment: `npm run drizzle:migrate`
4. Start app with `DB_AUTO_MIGRATE=false` (default in prod) and `next start`

#### One-off Ensure (useful in scripts/tests)

```bash
npm run db:ensure   # uses tsx to run TypeScript directly
```
Runs the same initialization logic explicitly (safe / idempotent).

#### When to Use `push` vs `generate/migrate`

| Command | Use Case | Notes |
|---------|----------|-------|
| `drizzle:push` | Rapid dev prototyping | Directly syncs schema; not intended for production history |
| `drizzle:generate` + `drizzle:migrate` | Stable, reviewable changes | Produces versioned migration SQL committed to VCS |

Avoid mixing `push` and generated migrations on the same database without resetting.

### Evolving the Schema (Step-by-Step)

1. Edit `lib/schema.ts`
2. Generate a migration: `npm run drizzle:generate`
3. Review the SQL files in `drizzle/` (ensure no destructive changes slipped in)
4. Apply locally: `npm run drizzle:migrate`
5. Run tests: `npm test`
6. Commit both the schema change and migration files
7. In CI/prod deploy pipeline run `npm run drizzle:migrate` before starting the app

If you just want a quick local reset during experimentation:
```bash
rm -f data/app.sqlite3
npm run drizzle:push
```
Then (optional) seed or re-init admin.

### Concurrency & Serverless Notes

SQLite + runtime migrations are fine for a single Node server. In serverless (multiple cold starts) concurrent migration attempts can race. Mitigations:
* Prefer running migrations in CI (disable auto via `DB_AUTO_MIGRATE=false`)
* Or move to a central RDBMS (e.g. Postgres) with migration locking if you scale horizontally

### Upgrading / Rolling Back

Drizzle currently focuses on forward migrations. To roll back, you typically:
1. Restore from backup (ensure you snapshot before applying prod migrations)
2. Or craft a manual reverse SQL migration

Always back up `data/app.sqlite3` before applying production migrations.

### Authentication Flow

1. **Development**: Simple username/password (any username works)
2. **Production**: Azure AD OAuth flow
3. **Session Management**: Handled by NextAuth.js
4. **API Protection**: All APIs require authentication
5. **Middleware**: Routes protected at the middleware level

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Unit Tests (Vitest)
npm run test

# End-to-End Tests (Playwright)
npx playwright test

# Test Coverage
npm run test -- --coverage
```

Test files are located in:
- `lib/__tests__/` - Library unit tests
- `components/__tests__/` - Component tests
- `test/` - Integration and E2E tests

## 🚀 Deployment

### Building for Production

```bash
npm run build
npm run start
```

### Environment Variables

Required for production:

```env
NODE_ENV=production
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
```

### Database Setup

The SQLite database is created in the `data/` directory (or `DATABASE_PATH`). Production checklist:
1. Ensure directory exists & writable (init script / container entrypoint)
2. Run `npm run drizzle:migrate` (CI/CD step) BEFORE `next start`
3. Keep `DB_AUTO_MIGRATE=false` unless you explicitly want runtime migrations
4. Back up the file regularly (volume snapshot, cron copy, etc.)
5. Consider migrating to Postgres if you need high concurrency or cloud scaling; Drizzle supports that with minimal code changes

## 🔒 Security

- **Authentication**: Required for all routes except login
- **Session Management**: Secure session cookies via NextAuth.js
- **Input Validation**: All inputs validated and sanitized
- **CSRF Protection**: Built-in protection
- **XSS Prevention**: React's built-in XSS protection + sanitization

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing TypeScript patterns
- Add tests for new features
- Run linting and formatting before committing
- Update documentation for API changes

## 🆚 Changes from Original

This fork includes major architectural improvements over [Medium's original Snowflake](https://github.com/Medium/snowflake):

### Technical Modernization
- **Next.js 15** with App Router (vs. older Next.js)
- **TypeScript** throughout (vs. JavaScript)
- **SQLite + Drizzle ORM** (vs. file-based storage)
- **Modern React** with hooks and functional components

### New Features
- **Database Persistence**: All data stored in SQLite
- **User Authentication**: Azure AD + development credentials
- **Admin Dashboard**: User and access management
- **Enhanced Comments**: Threaded discussions on skills
- **Archive System**: Historical milestone tracking

### Simplified Architecture
- **One Report Per User**: Eliminated complex report sharing
- **Username-based Keys**: Simplified user identification
- **Role-based Access**: Admin/user permission system

### Developer Experience
- **Hot Reload**: Instant development feedback
- **Comprehensive Testing**: Unit + E2E test coverage
- **Modern Tooling**: ESLint 9, Prettier, TypeScript
- **Type Safety**: Full type coverage for APIs and components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Medium Engineering** for the original Snowflake framework and career development concepts
- **The Snowflake Community** for continued development and feedback

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the documentation
- Review the original Medium blog posts about the framework

---

**Note**: This is a modernized fork of Medium's Snowflake tool. While Medium is no longer actively using this tool, the career development framework remains valuable for engineering organizations.

---

### Appendix: Startup Flow Summary

1. Next.js loads `instrumentation.ts` and calls `register()`
2. If auto-migrate enabled, `ensureDatabase()` runs migrations once per process
3. Server components & route handlers import `lib/db.ts` and reuse the ready connection
4. First admin can be initialized via `/api/init-admin`

To disable runtime migrations entirely set:
```env
DB_AUTO_MIGRATE=false
```

To force them even in production (use cautiously):
```env
DB_AUTO_MIGRATE=true
```



import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DATABASE_PATH || 'data/app.sqlite3';

export async function setupDatabase() {
  try {
    // Ensure the directory for the database exists
    mkdirSync(dirname(DB_PATH), { recursive: true });

    const sqlite = new Database(DB_PATH);
    const db = drizzle(sqlite);

    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database migrations completed.');

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}
