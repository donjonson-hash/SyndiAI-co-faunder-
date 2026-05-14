# SyndiAI

AI-powered co-founder matching platform. Think Tinder, but for finding the perfect startup co-founder. The intelligent matching engine analyzes compatibility across five key dimensions to suggest optimal partnerships.

## Features

- **Swipe Discovery** - Browse founder profiles with an intuitive card-based interface
- **AI Compatibility Analysis** - Deep analysis across 5 dimensions: Vision, Skills, Values, Commitment, Communication
- **Real-time Matching** - Instant match notifications when both founders swipe right
- **Chat with AI Icebreakers** - Built-in messaging with AI-generated conversation starters
- **PostgreSQL Database** - Robust relational data storage
- **Rate Limiting** - Protection against spam and abuse
- **Docker Support** - Ready for local development and production deployment

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts (Radar) |
| Backend | tRPC + Drizzle ORM + Hono |
| Database | PostgreSQL 16 |
| Auth | OAuth 2.0 + JWT |
| Container | Docker + Docker Compose |

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Option 1: Docker (Recommended)

```bash
# Development stack (PostgreSQL + PGAdmin)
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
npm install

# Push schema and start dev server
npm run db:push
npm run dev
```

### Option 2: Full Docker Stack

```bash
# Everything in containers
docker compose up -d --build
```

### Option 3: Local PostgreSQL

```bash
# 1. Set up PostgreSQL locally
# 2. Update DATABASE_URL in .env
# 3. Install and run
npm install
npm run db:push
npm run dev
```

## Scripts

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm run check      # TypeScript type check
npm run test       # Run test suite
npm run db:push    # Sync schema to database
npm run db:generate # Generate migration SQL
npm run start      # Start production server
```

## Project Structure

```
SyndiAI/
├── api/                   # Backend
│   ├── lib/              # Utilities (matching engine, rate limiter)
│   ├── queries/          # Database query functions
│   ├── kimi/             # OAuth authentication
│   ├── auth-router.ts    # Auth endpoints
│   ├── profile-router.ts # Profile CRUD
│   ├── swipe-router.ts   # Swipe & matching logic
│   ├── match-router.ts   # Matches & messaging
│   ├── router.ts         # Router aggregation
│   ├── middleware.ts     # tRPC procedures
│   └── boot.ts           # Server entry point
├── contracts/             # Shared types (frontend + backend)
├── db/                    # Database
│   ├── schema.ts         # Table definitions
│   └── relations.ts      # Drizzle relations
├── src/                   # Frontend
│   ├── pages/            # Route pages
│   ├── components/       # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers (tRPC)
│   └── lib/              # Utilities
├── public/                # Static assets (avatars)
├── docker-compose*.yml   # Docker configs
└── Dockerfile             # Production image
```

## API Endpoints

| Router | Procedure | Auth | Description |
|--------|-----------|------|-------------|
| `auth` | `me` | Yes | Get current user |
| `auth` | `logout` | Yes | End session |
| `profile` | `me` | Yes | Get own profile |
| `profile` | `create` | Yes | Create profile |
| `profile` | `update` | Yes | Update profile |
| `profile` | `discover` | Yes | Get profiles to swipe |
| `swipe` | `create` | Yes | Record swipe (rate-limited) |
| `match` | `list` | Yes | Get matches |
| `match` | `analyze` | Yes | AI compatibility analysis |
| `match` | `messages` | Yes | Get chat messages |
| `match` | `sendMessage` | Yes | Send message (rate-limited) |

## AI Matching Engine

The compatibility algorithm is fully deterministic - the same two profiles always produce the same score. It evaluates:

- **Vision & Goals** (25%) - Alignment of startup vision and market focus
- **Skills** (25%) - Complementarity of technical and business skills
- **Values & Culture** (20%) - Experience level alignment
- **Commitment & Risk** (15%) - Time availability match
- **Communication** (15%) - Interaction style compatibility

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| App | 3000 | SyndiAI application |
| PostgreSQL | 5432 | Database |
| PGAdmin | 5050 | Database management UI |

## Testing

```bash
npm run test
```

10 tests covering:
- AI matching engine (determinism, edge cases, complementarity)
- Router structure validation

## License

MIT
