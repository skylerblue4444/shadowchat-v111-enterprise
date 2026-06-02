# 🚀 ShadowChat v111 - PRODUCTION DEPLOYMENT PLAYBOOK

## 📋 Deployment Overview

This guide covers **enterprise-grade production deployment** of ShadowChat v111 across multiple platforms:
- ✅ **Local/VPS** (Node.js directly)
- ✅ **Docker** (Containerized)
- ✅ **Kubernetes** (Orchestrated)
- ✅ **AWS/Cloud** (Managed services)

---

## 🎯 Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed globally
- [ ] MySQL 8+ running (or cloud database)
- [ ] Environment variables prepared
- [ ] SSL/HTTPS certificates ready
- [ ] Domain DNS configured
- [ ] Monitoring tools setup
- [ ] Backup strategy in place

---

## 📦 Option 1: Direct Node.js Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/skylerblue4444/shadowchat-v111-enterprise.git
cd shadowchat-v111-enterprise
```

### Step 2: Install Dependencies
```bash
pnpm install --frozen-lockfile
```

### Step 3: Configure Environment
```bash
# Create .env.production
cat > .env.production << EOF
# Database
DATABASE_URL=mysql://user:password@db-host:3306/shadowchat

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security
ENCRYPTION_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://yourdomain.com

# Features
EVOLUTION_ENABLED=true
ANALYTICS_ENABLED=true
RATE_LIMIT=1000

# Optional: AI Integration
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
EOF
```

### Step 4: Database Setup
```bash
# Push database schema
pnpm db:push

# Seed initial data
pnpm seed
```

### Step 5: Build for Production
```bash
pnpm build
```

### Step 6: Start Production Server
```bash
# Option A: Direct start
pnpm start

# Option B: With PM2 (recommended)
npm install -g pm2
pm2 start "pnpm start" --name "shadowchat"
pm2 save
pm2 startup
```

### Step 7: Verify Deployment
```bash
# Health check
curl http://localhost:3000/health

# Check metrics
curl http://localhost:3000/metrics
```

---

## 🐳 Option 2: Docker Deployment (Recommended)

### Step 1: Create Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lock file
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start
CMD ["pnpm", "start"]
```

### Step 2: Build Docker Image
```bash
docker build -t shadowchat:v111 .
```

### Step 3: Create docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: shadowchat
      MYSQL_USER: shadowchat
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://shadowchat:${DB_PASSWORD}@db:3306/shadowchat
      REDIS_URL: redis://redis:6379
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: https://yourdomain.com
      EVOLUTION_ENABLED: "true"
      ANALYTICS_ENABLED: "true"
      RATE_LIMIT: "1000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  db-data:
  redis-data:
```

### Step 4: Create .env File
```bash
cat > .env << EOF
DB_ROOT_PASSWORD=root_password_123
DB_PASSWORD=user_password_456
ENCRYPTION_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
EOF
```

### Step 5: Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

### Step 6: Database Migration
```bash
# Run inside container
docker-compose exec app pnpm db:push
docker-compose exec app pnpm seed
```

---

## ☸️ Option 3: Kubernetes Deployment

### Step 1: Create Docker Image (same as Option 2)
```bash
docker build -t shadowchat:v111 .
docker tag shadowchat:v111 your-registry/shadowchat:v111
docker push your-registry/shadowchat:v111
```

### Step 2: Create Kubernetes Manifests

**k8s/namespace.yaml**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: shadowchat
```

**k8s/configmap.yaml**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: shadowchat-config
  namespace: shadowchat
data:
  NODE_ENV: "production"
  EVOLUTION_ENABLED: "true"
  ANALYTICS_ENABLED: "true"
  RATE_LIMIT: "1000"
  LOG_LEVEL: "info"
```

**k8s/secret.yaml**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: shadowchat-secrets
  namespace: shadowchat
type: Opaque
stringData:
  DATABASE_URL: mysql://user:password@mysql.shadowchat.svc.cluster.local:3306/shadowchat
  ENCRYPTION_KEY: YOUR_ENCRYPTION_KEY_HERE
  JWT_SECRET: YOUR_JWT_SECRET_HERE
  REDIS_URL: redis://redis.shadowchat.svc.cluster.local:6379
```

**k8s/deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shadowchat
  namespace: shadowchat
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: shadowchat
  template:
    metadata:
      labels:
        app: shadowchat
    spec:
      containers:
      - name: shadowchat
        image: your-registry/shadowchat:v111
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: shadowchat-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: shadowchat-secrets
              key: DATABASE_URL
        - name: ENCRYPTION_KEY
          valueFrom:
            secretKeyRef:
              name: shadowchat-secrets
              key: ENCRYPTION_KEY
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: shadowchat-secrets
              key: JWT_SECRET
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1024Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: shadowchat
  namespace: shadowchat
spec:
  type: LoadBalancer
  selector:
    app: shadowchat
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
    name: http
  - protocol: TCP
    port: 443
    targetPort: 3000
    name: https

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: shadowchat-hpa
  namespace: shadowchat
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: shadowchat
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Step 3: Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy config and secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Check deployment
kubectl get pods -n shadowchat
kubectl get svc -n shadowchat

# View logs
kubectl logs -f deployment/shadowchat -n shadowchat
```

---

## 🌐 Option 4: Cloud Deployment

### AWS (Elastic Container Service)
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker tag shadowchat:v111 YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/shadowchat:v111
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/shadowchat:v111

# Deploy with CloudFormation or AWS CLI
# (See AWS documentation for detailed steps)
```

### Heroku
```bash
# Login
heroku login

# Create app
heroku create shadowchat-111

# Add buildpack
heroku buildpacks:add --index 1 heroku/nodejs

# Set environment variables
heroku config:set DATABASE_URL=mysql://...
heroku config:set ENCRYPTION_KEY=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 🔒 Production Security Setup

### 1. Enable HTTPS
```bash
# Generate SSL certificate (Let's Encrypt)
sudo certbot certonly --standalone -d yourdomain.com

# Update .env
HTTPS=true
SSL_CERT=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
SSL_KEY=/etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### 2. Set Security Headers
```bash
# Add to .env.production
CORS_ORIGIN=https://yourdomain.com
CSP_HEADER="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
HSTS_MAX_AGE=31536000
```

### 3. Configure Rate Limiting
```bash
RATE_LIMIT=1000
RATE_LIMIT_WINDOW=60
RATE_LIMIT_ENABLE=true
```

### 4. Enable Authentication
```bash
AUTH_PROVIDER=google  # or github, microsoft
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRET=...
```

---

## 📊 Monitoring & Logging

### Setup Monitoring
```bash
# Health check endpoint
curl https://yourdomain.com/health

# Metrics endpoint
curl https://yourdomain.com/metrics

# Application logs
# Via Docker: docker logs -f container-name
# Via K8s: kubectl logs -f pod-name
# Via PM2: pm2 logs shadowchat
```

### Recommended Tools
- **APM**: DataDog, New Relic, Elastic APM
- **Logging**: ELK Stack, Splunk, CloudWatch
- **Monitoring**: Prometheus + Grafana
- **Uptime**: UptimeRobot, Pingdom

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm build
      - run: pnpm test

      - name: Deploy to Production
        run: |
          chmod +x ./deploy.sh
          ./deploy.sh
```

---

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Verify database
mysql -h db-host -u user -p -e "SELECT 1;"

# Check DATABASE_URL format
echo $DATABASE_URL

# Push schema again
pnpm db:push
```

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm start
```

### Out of Memory
```bash
# Check memory usage
docker stats

# Increase memory limit
# Docker: update docker-compose.yml memory settings
# K8s: update deployment.yaml resources.limits
```

### Slow Performance
```bash
# Check metrics
curl http://localhost:3000/metrics

# Review logs
docker logs -f app

# Run optimizer
curl -X POST http://localhost:3000/api/optimize
```

---

## ✅ Post-Deployment Checklist

- [ ] Application running and healthy
- [ ] Database connected and seeded
- [ ] HTTPS/SSL enabled
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Logging setup complete
- [ ] Error alerting enabled
- [ ] Performance metrics tracking
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] AI features (Evolution, Neural Forge) initialized
- [ ] Analytics tracking events

---

## 🚀 Scale to Production

### For 10k+ Users:
- Horizontal scaling: 3+ app replicas
- Database: Read replicas, master-slave setup
- Cache: Redis cluster
- CDN: CloudFront, Cloudflare
- Load Balancer: NGINX, HAProxy

### For 100k+ Users:
- Kubernetes with auto-scaling
- Database sharding
- Multi-region deployment
- Advanced caching strategy
- Dedicated AI inference servers
- Event streaming (Kafka)

---

## 📞 Support

- 📧 Email: support@shadowchat.io
- 🐛 Issues: GitHub Issues
- 💬 Discord: https://discord.gg/shadowchat
- 📞 Enterprise: enterprise@shadowchat.io

---

**Status**: ✅ Production Ready  
**Version**: 111.0.0  
**Last Updated**: June 2, 2026
