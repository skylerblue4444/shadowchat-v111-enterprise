# 🚀 ShadowChat v111 — Quick Start Guide

**HOPE AI × SKYCOIN4444 Enterprise Platform**

---

## ⚡ One-Click Startup

### Development Server (macOS / Linux)
```bash
./start-dev.sh
```

### Development Server (Windows)
```bash
start-dev.bat
```

### Production Server (macOS / Linux)
```bash
./start-prod.sh
```

### Production Server (Windows)
```bash
start-prod.bat
```

---

## 🎯 What These Scripts Do

### `start-dev.sh` / `start-dev.bat`
- ✅ Checks for dependencies (installs if missing)
- ✅ Creates `.env` file from `.env.example` (if needed)
- ✅ Starts the Vite dev server on `http://localhost:3000`
- ✅ Enables hot module replacement (HMR)
- ✅ Shows local and network URLs

### `start-prod.sh` / `start-prod.bat`
- ✅ Checks for dependencies (installs if missing)
- ✅ Creates `.env` file from `.env.example` (if needed)
- ✅ Builds the entire project for production
- ✅ Starts the production server on `http://localhost:3000`
- ✅ Optimized for performance and security

---

## 📋 Manual Commands

If you prefer manual control:

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm check

# Format code
pnpm format

# Run tests
pnpm test
```

---

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and update:

```env
# Database
DATABASE_URL=your_database_url

# OAuth / Authentication
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret

# API Keys
STRIPE_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key

# Server
PORT=3000
NODE_ENV=development
```

---

## 🌐 Access Points

| Environment | URL | Purpose |
|---|---|---|
| **Development** | `http://localhost:3000` | Local development with HMR |
| **Production** | `http://localhost:3000` | Optimized production build |
| **Network** | `http://<your-ip>:3000` | Access from other devices |

---

## 📦 Project Structure

```
shadowchat-v111-enterprise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 32+ feature pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.tsx        # Main app component
│   └── index.html         # Entry point
├── server/                # Express backend
│   ├── _core/            # Core server logic
│   ├── routers/          # API routes
│   ├── services/         # Business logic
│   └── index.ts          # Server entry
├── shared/               # Shared types & utilities
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
├── start-dev.sh          # Dev startup (Unix)
├── start-dev.bat         # Dev startup (Windows)
├── start-prod.sh         # Prod startup (Unix)
└── start-prod.bat        # Prod startup (Windows)
```

---

## 🎨 UI/UX Features

### Premium Design System
- **Glassmorphism**: Frosted glass panels with backdrop blur
- **Neon Accents**: Cyan, emerald, and purple glow effects
- **Typography**: Syne (headers) + Space Grotesk (body) + Space Mono (data)
- **Dark Luxury**: Deep space black (#050510) with sophisticated gradients

### Hope AI Integration
- Real-time AI metrics and health monitoring
- AI-powered agent marketplace
- Intelligent data analytics
- Automated decision-making

### Skycoin4444 Tokenomics
- Integrated wallet and exchange
- Tokenomics dashboard
- Governance and voting
- Staking and rewards

---

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

Output: `dist/` directory with optimized assets

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# macOS / Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Fails
```bash
# Check TypeScript errors
pnpm check

# Clean and rebuild
pnpm clean
pnpm build
```

---

## 📞 Support

For issues or questions:
1. Check the logs in the terminal
2. Review `.env` configuration
3. Ensure Node.js 22+ is installed
4. Check GitHub repository for updates

---

## 📜 License

MIT © 2026 Innovative Information Technology Resolutions LLC

---

**Built with ❤️ by Skyler Blue**  
**Powered by Hope AI × Skycoin4444**
