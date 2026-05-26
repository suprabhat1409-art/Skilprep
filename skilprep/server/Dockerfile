FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=builder /app .
EXPOSE 5000
CMD ["node", "src/server.js"]
