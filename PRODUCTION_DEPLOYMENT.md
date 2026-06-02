# 🚀 ShadowChat v111 - Production Deployment Guide

## Quick Deploy Script

```bash
#!/bin/bash
# deploy.sh - One-command production deployment

set -e

echo "🚀 ShadowChat v111 Production Deployment"
echo "=========================================="

# 1. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 2. Setup database
echo "🗄️  Setting up database..."
pnpm db:push
pnpm seed

# 3. Build
echo "🔨 Building application..."
pnpm build

# 4. Start
echo "✅ Starting production server..."
pnpm start

echo "🎉 Deployment complete!"
echo "Server running at http://localhost:3000"
```

## Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

## Environment Setup

```bash
# .env.production
DATABASE_URL=mysql://user:password@db:3306/shadowchat
NODE_ENV=production
ENCRYPTION_KEY=<your-256-bit-key>
JWT_SECRET=<your-jwt-secret>
EVOLUTION_ENABLED=true
ANALYTICS_ENABLED=true
RATE_LIMIT=1000
```

## Health Check

```bash
curl http://localhost:3000/health
```

## Monitoring

```bash
# View logs
docker logs -f shadowchat

# Check metrics
curl http://localhost:3000/metrics
```

## Rollback

```bash
docker run -p 3000:3000 shadowchat:v110
```

---

**Status**: Ready for production deployment
