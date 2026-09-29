FROM node:22-bookworm-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma


FROM base AS build

RUN npm ci

COPY frontend ./frontend
COPY vite.config.js ./

RUN npm run build


FROM base AS runtime

ENV NODE_ENV=production

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY backend ./backend
COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["npm", "start"]