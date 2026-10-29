# OpsPilot Demo Service Dockerfile
FROM node:20-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=5002

# Install curl for container health checks
RUN apk add --no-cache curl

# Security: Run as unprivileged user
USER node

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 5002

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5002/healthz || exit 1

CMD ["node", "src/index.js"]
