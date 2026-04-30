# DevMatch — Backend

Node.js + Express + Prisma + PostgreSQL API for DevMatch (Tinder-style swipe app for developers).

## Folder structure

```
backend/
├── prisma/
│   └── schema.prisma          # DB schema
├── src/
│   ├── config/                # env loader, prisma client
│   ├── controllers/           # request handlers (thin)
│   ├── services/              # business logic (matching, ranking)
│   ├── routes/                # express routers
│   ├── middlewares/           # auth, error handler, validation
│   ├── utils/                 # helpers (jwt, hashing, score)
│   ├── app.js                 # express app
│   └── server.js              # entry point
├── .env.example
└── package.json
```

## Prerequisites

- Node.js >= 18
- PostgreSQL running locally (or a remote URL)

## Setup

```bash
cd backend
npm install
cp .env.example .env          # then edit DATABASE_URL & JWT_SECRET
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Health check: `GET http://localhost:5000/health`

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API in production mode |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run a dev migration |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

## Roadmap

- [x] Step 1 — Backend setup (Express, Prisma, env, error handling)
- [ ] Step 2 — Prisma schema (User, Skill, Swipe, Match)
- [ ] Step 3 — Auth APIs (register / login with JWT)
- [ ] Step 4 — Developer fetch API (filtering + ranking)
- [ ] Step 5 — Swipe + match logic
