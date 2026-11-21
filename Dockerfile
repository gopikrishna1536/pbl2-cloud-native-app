FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine

WORKDIR /app
# Use non-root user for cloud-native container security
USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 8080

CMD ["node", "src/server.js"]
