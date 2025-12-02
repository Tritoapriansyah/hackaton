# Multi-stage build untuk optimasi ukuran image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY adonisrc.ts ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build aplikasi
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Install dumb-init untuk proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/start ./start
COPY --from=builder /app/app ./app
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/resources ./resources
COPY --from=builder /app/public ./public
COPY --from=builder /app/inertia ./inertia
COPY --from=builder /app/ace.js ./
COPY --from=builder /app/adonisrc.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/openapi.yaml ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "bin/server.js"]

