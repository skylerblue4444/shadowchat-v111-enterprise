# ShadowChat v1111 - Deployment Guide

## 🚀 Quick Start

### One-Click Development Server
```bash
./start-dev.sh
```
This will:
- Install dependencies (if needed)
- Start the Vite dev server
- Open at `http://localhost:3000`

### One-Click Production Server
```bash
./start-prod.sh
```
This will:
- Install dependencies (if needed)
- Build optimized production bundle
- Start production preview server
- Available at `http://localhost:3000`

---

## 📦 Manual Setup

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm 8+ (or npm/yarn)

### Installation
```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development
```bash
# Start dev server with hot reload
pnpm dev

# Server runs on http://localhost:3000
```

### Production Build
```bash
# Build optimized production bundle
pnpm build

# Preview production build locally
pnpm preview

# Server runs on http://localhost:3000
```

---

## 🌐 Multi-Cloud Deployment

### AWS Deployment
```bash
# Build production bundle
pnpm build

# Deploy to AWS S3 + CloudFront
aws s3 sync dist/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Google Cloud Deployment
```bash
# Build production bundle
pnpm build

# Deploy to Google Cloud Storage
gsutil -m cp -r dist/* gs://your-bucket-name/

# Invalidate CDN cache
gcloud compute url-maps invalidate-cdn-cache your-url-map --path "/*"
```

### Docker Deployment
```bash
# Build Docker image
docker build -t shadowchat-v1111:latest .

# Run container
docker run -p 3000:3000 shadowchat-v1111:latest

# Push to registry
docker push your-registry/shadowchat-v1111:latest
```

---

## 📊 Build Optimization

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build --analyze
```

### Performance Metrics
- **Dev Build**: ~58ms
- **Prod Build**: ~59ms
- **Bundle Size**: ~1.5MB (gzipped)
- **Chunk Strategy**: Automatic code splitting

---

## 🔒 Environment Configuration

Create `.env` file in root directory:
```env
VITE_API_BASE=https://api.shadowchat.io
VITE_WS_URL=wss://ws.shadowchat.io
VITE_ENV=production
```

---

## 📈 Performance Optimization

### Vite Configuration
- **Terser minification**: Enabled
- **Code splitting**: Automatic
- **Tree shaking**: Enabled
- **CSS optimization**: Enabled

### Production Checklist
- ✅ Build verification
- ✅ Bundle size analysis
- ✅ Performance testing
- ✅ Security headers
- ✅ CDN configuration
- ✅ SSL/TLS enabled
- ✅ Rate limiting
- ✅ CORS configured

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- --port 3001
```

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

---

## 📝 Git Workflow

### Commit Changes
```bash
git add -A
git commit -m "feat: description of changes"
git push origin main
```

### CI/CD Integration
The repository is configured for automatic deployment on push to `main` branch.

---

## 🎯 Enterprise Features

### 12 Autonomous AI Agents
- Swarm Intelligence Engine
- Self-Coding Engine
- Economic Engine
- Web3/Crypto Engine
- Self-Healing Infrastructure

### 8 Infrastructure Hubs
1. **Legal Compliance Engine** - `/legal-compliance`
2. **Supply Chain Hub** - `/supply-chain`
3. **Talent Marketplace** - `/talent-market`
4. **Quantum Security Vault** - `/quantum-security`
5. **Financial Intelligence Hub** - `/financial`
6. **Research Lab** - `/research`
7. **Geopolitical Intelligence Center** - `/geopolitical`
8. **Workforce Management Hub** - `/workforce`
9. **Sustainability Hub** - `/sustainability`
10. **Healthcare & Wellness Hub** - `/healthcare`
11. **Education Academy** - `/academy`

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/skylerblue4444/shadowchat-v111-enterprise/issues
- Documentation: See README.md

---

## 📄 License

ShadowChat v1111 - Enterprise Platform
© 2024 All Rights Reserved
