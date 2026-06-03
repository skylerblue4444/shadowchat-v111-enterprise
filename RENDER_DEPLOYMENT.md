# 🚀 Deploy ShadowChat v111 to Render (SQLite) - FREE

## ⚡ Quick Deploy (5 Minutes)

### Step 1: Create `.env.production`

```bash
# Database (SQLite - no external DB needed!)
DATABASE_URL=file:./data/shadowchat.db

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security
ENCRYPTION_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=*

# Features
EVOLUTION_ENABLED=true
ANALYTICS_ENABLED=true
RATE_LIMIT=100
```

### Step 2: Update `package.json` Scripts

Add/update these scripts in your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "node scripts/seed.js",
    "deploy": "pnpm build && pnpm db:migrate"
  }
}
```

### Step 3: Create `render.yaml`

```yaml
services:
  - type: web
    name: shadowchat-api
    env: node
    plan: free
    buildCommand: pnpm install --frozen-lockfile && pnpm build
    startCommand: pnpm start
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        value: file:./data/shadowchat.db
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

### Step 4: Go to Render Dashboard

1. Visit **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shadowchat-api`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: `Free`

### Step 5: Add Environment Variables

In Render dashboard → **Environment** tab:

```
DATABASE_URL = file:./data/shadowchat.db
NODE_ENV = production
ENCRYPTION_KEY = (generate with: openssl rand -base64 32)
JWT_SECRET = (generate with: openssl rand -base64 32)
EVOLUTION_ENABLED = true
ANALYTICS_ENABLED = true
RATE_LIMIT = 100
```

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render auto-deploys from GitHub
3. Wait ~2 minutes for build
4. Get your live URL: `https://shadowchat-xxx.onrender.com`

---

## ✅ Verification

### Test Your Deployment

```bash
# Check health
curl https://shadowchat-xxx.onrender.com/health

# Check metrics
curl https://shadowchat-xxx.onrender.com/metrics

# View logs
# In Render dashboard → Logs tab
```

---

## 🗄️ SQLite Database Details

### Database Location
```
./data/shadowchat.db
```

### Database Size Limits
- **Free Tier**: SQLite handles up to 1GB easily
- **Render Storage**: 100GB available on free tier
- **Performance**: Fast for <50k records

### Backup Strategy
```bash
# Local backup before deploying
sqlite3 data/shadowchat.db ".backup data/shadowchat-backup.db"

# Render auto-stores in volume
# But download periodically:
```

### Data Persistence
- ✅ Data persists across deployments
- ✅ Stored in `/data` directory
- ✅ Survive app restarts
- ⚠️ Lost if instance is destroyed (rare on Render free)

---

## 📊 Architecture

```
┌─────────────────────────────────┐
│   Your Browser (User)           │
└────────────────┬────────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │  Render.com       │
         │  (Free Tier)      │
         ├───────────────────┤
         │  Node.js App      │
         │  (ShadowChat v111)│
         │                   │
         │  ↓               │
         │  SQLite DB       │
         │  (./data/*)      │
         └───────────────────┘
```

---

## 🔧 Configuration Files

### `render.yaml` (Render-specific config)
```yaml
services:
  - type: web
    name: shadowchat
    env: node
    plan: free
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: DATABASE_URL
        value: file:./data/shadowchat.db
      - key: NODE_ENV
        value: production
```

### `.env.production` (Local - don't commit!)
```
DATABASE_URL=file:./data/shadowchat.db
NODE_ENV=production
ENCRYPTION_KEY=your-key-here
JWT_SECRET=your-secret-here
EVOLUTION_ENABLED=true
ANALYTICS_ENABLED=true
```

### `.gitignore` (Already have these?)
```
.env
.env.local
.env.production
data/shadowchat.db
node_modules
dist
```

---

## 📋 Deployment Checklist

- [ ] Created `.env.production` with SQLite path
- [ ] Updated `package.json` scripts
- [ ] Created `render.yaml`
- [ ] Committed to GitHub
- [ ] Connected Render to GitHub repo
- [ ] Set environment variables in Render
- [ ] Deployed to Render
- [ ] Tested `/health` endpoint
- [ ] Confirmed database working

---

## 🚀 Deploy Steps Summary

```bash
# 1. Prepare locally
echo 'DATABASE_URL=file:./data/shadowchat.db' > .env.production

# 2. Commit
git add .
git commit -m "chore: prepare for Render deployment with SQLite"
git push

# 3. Go to Render
# https://dashboard.render.com

# 4. Create Web Service
# Select your repo → Configure → Deploy

# 5. Done! 🎉
# Live at: https://shadowchat-xxx.onrender.com
```

---

## 🐛 Troubleshooting

### Database Not Found
```bash
# Create data directory
mkdir -p data

# Initialize database
touch data/shadowchat.db

# Commit
git add data/
git commit -m "chore: initialize SQLite database"
git push
```

### Port Already in Use
```bash
# Render assigns port automatically
# Just set: PORT=3000 in env vars
# Render handles the routing
```

### Build Fails
```bash
# Check logs in Render dashboard
# Common issues:
# 1. Missing dependencies → pnpm install
# 2. Wrong build script → check package.json
# 3. Syntax errors → pnpm type-check locally
```

### Database Locked
```bash
# SQLite can have locking issues
# Solution: WAL mode
# Add to database initialization:
PRAGMA journal_mode=WAL;
```

---

## 💡 Optimization Tips

### 1. Enable Caching
```env
CACHE_ENABLED=true
CACHE_TTL=3600
```

### 2. Optimize Database
```bash
# Add indexes for common queries
sqlite3 data/shadowchat.db "CREATE INDEX idx_users_email ON users(email);"
```

### 3. Limit Log Output
```env
LOG_LEVEL=warn
```

### 4. Monitor Performance
```bash
# Check in Render dashboard
# CPU: Should be <10% idle
# Memory: Should be <100MB
# Database: Should be <100MB
```

---

## 📈 Scaling (When You Grow)

### Stage 1: Current (Free)
- SQLite database
- Single Render instance
- Cost: $0
- Users: Up to 1,000

### Stage 2: Growing ($7/month)
- PostgreSQL (PlanetScale free tier)
- Multiple Render replicas
- Cost: $7/month
- Users: 1,000-10,000

### Stage 3: Production (Flexible)
- PostgreSQL on managed service
- Auto-scaling
- Cost: $20-100+/month
- Users: 10,000+

---

## ✅ Success Indicators

After deployment, you should see:

1. ✅ Render shows "Deploy successful"
2. ✅ Your app running on free tier
3. ✅ `/health` endpoint returns 200
4. ✅ Database file created in `/data/`
5. ✅ Logs showing app started
6. ✅ Features working (AI, analytics, etc.)

---

## 🎯 Your Live Deployment

After completing these steps:

- **Frontend**: https://skylerblue4444.github.io/shadowchat-v111-enterprise/
- **Backend API**: https://shadowchat-xxx.onrender.com
- **Cost**: $0 (completely free)
- **Database**: SQLite (no external DB needed)

---

## 🔗 Quick Links

- Render Dashboard: https://dashboard.render.com
- ShadowChat Repo: https://github.com/skylerblue4444/shadowchat-v111-enterprise
- Documentation: README.md in your repo

---

## 💬 Questions?

If deployment fails, check:
1. Build logs in Render dashboard
2. Environment variables are set
3. GitHub repo is public (Render can access)
4. `package.json` has correct scripts
5. `.env.production` has SQLite path

---

**Status**: Ready to Deploy ✅  
**Cost**: $0 Forever  
**Time**: ~10 minutes  
**Difficulty**: Easy ⭐⭐☆☆☆

Deploy now! 🚀
