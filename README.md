# Mood Tracker

A wellness mood tracker built with React, Express, Prisma, and PostgreSQL.

## Features

- Email/password accounts with HttpOnly auth cookies
- Daily mood check-ins
- City-level anonymous mood averages
- Private journal entries
- Reusable daily habits and completion tracking
- Railway-ready single-service deployment with PostgreSQL

## Local setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` plus `JWT_SECRET`.

3. Apply database migrations:

   ```sh
   npm run db:dev
   ```

4. Start the app locally:

   ```sh
   npm run dev
   ```

The API runs on `http://localhost:3000` and the Vite frontend runs on `http://localhost:5173`.

## Railway

Provision a Railway PostgreSQL service and set the app service variables:

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `JWT_SECRET=<long random secret>`
- `NODE_ENV=production`

Then run migrations with `npm run db:migrate` and deploy the app service.
