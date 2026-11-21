FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG EFARDA_SITE_URL=http://localhost:8080
ENV EFARDA_SITE_URL=$EFARDA_SITE_URL
RUN EFARDA_STANDALONE=1 npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 EFARDA_DB_PATH=/var/lib/efarda/site.sqlite HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
RUN install -d -m 0700 -o node -g node /var/lib/efarda
USER node
EXPOSE 3000
CMD ["node", "server.js"]
