# 🚀 ShadowChat v111 Enterprise - Quick Start Guide

## Installation (5 minutes)

```bash
# 1. Extract the zip
unzip ShadowChat_v111_Enterprise_Final.zip
cd shadowchat_master

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local

# 4. Setup database
pnpm db:push
pnpm seed

# 5. Start development server
pnpm dev
```

Your platform is now running at `http://localhost:3000`

---

## Key Features Overview

### AI Self-Evolution (Automatic)
The platform continuously improves itself. No configuration needed—it just works.

**Monitor Progress**:
```bash
# Check evolution status
curl http://localhost:3000/api/evolution/status
```

### Enterprise Security (Enabled by Default)
All requests are automatically encrypted, validated, and logged.

**Verify Security**:
```bash
# Check security headers
curl -I http://localhost:3000
```

### Real-Time Analytics (Dashboard)
Visit `http://localhost:3000/analytics` to see live metrics.

**Key Metrics**:
- Active users
- Conversion rates
- Performance metrics
- Anomalies

### Premium UI Components (Ready to Use)
```typescript
import { PremiumButton, PremiumCard, PremiumModal } from "@/components/ui/PremiumComponents";

export function MyComponent() {
  return (
    <PremiumCard title="Welcome">
      <PremiumButton variant="primary">Click me</PremiumButton>
    </PremiumCard>
  );
}
```

---

## Configuration

### Database
Edit `.env.local`:
```env
DATABASE_URL=mysql://user:password@localhost:3306/shadowchat
```

### AI Evolution
```env
EVOLUTION_ENABLED=true
EVOLUTION_INTERVAL=60000  # milliseconds
EVOLUTION_MAX_ACTIONS=5
```

### Security
```env
ENCRYPTION_KEY=your-256-bit-key
JWT_SECRET=your-jwt-secret
RATE_LIMIT=1000  # requests per minute
```

### Analytics
```env
ANALYTICS_ENABLED=true
ANALYTICS_EXPORT_FORMAT=json  # json or csv
```

---

## Development

### File Structure
```
shadowchat_master/
├── server/
│   ├── routers/
│   │   └── ai-evolution.ts          # AI engine
│   ├── services/
│   │   ├── auto-evolution.ts        # Evolution service
│   │   ├── intelligent-optimizer.ts # Optimizer
│   │   └── advanced-analytics.ts    # Analytics
│   └── integrations/
│       ├── dev-environment.ts       # Dev tools
│       ├── enterprise-patterns.ts   # 10 patterns
│       ├── enterprise-security.ts   # Security
│       └── enterprise-codebase.ts   # Company patterns
├── client/
│   └── components/
│       └── ui/
│           └── PremiumComponents.tsx # UI library
├── PRESENTATION_SCRIPT.md           # Presentation
├── UPGRADE_MANIFEST.md              # Code inventory
└── EVOLUTION.md                     # AI docs
```

### Adding a New Route
```typescript
// server/routers/my-feature.ts
import { router, publicProcedure } from "@/server/trpc";

export const myFeatureRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
```

### Using Premium Components
```typescript
import { PremiumButton, PremiumInput, PremiumDropdown } from "@/components/ui/PremiumComponents";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <PremiumInput
        placeholder="Email"
        value={email}
        onChange={setEmail}
        type="email"
      />
      <PremiumInput
        placeholder="Password"
        value={password}
        onChange={setPassword}
        type="password"
      />
      <PremiumButton variant="primary" onClick={() => console.log("Login")}>
        Sign In
      </PremiumButton>
    </div>
  );
}
```

---

## Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Docker Deployment
```bash
# Build image
docker build -t shadowchat:v111 .

# Run container
docker run -p 3000:3000 shadowchat:v111
```

### Kubernetes Deployment
```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl logs -f deployment/shadowchat
```

---

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Metrics Endpoint
```bash
curl http://localhost:3000/metrics
```

### Logs
```bash
# Development
pnpm dev  # Logs in console

# Production
docker logs <container-id>
kubectl logs <pod-name>
```

---

## Troubleshooting

### Database Connection Error
```bash
# Check database is running
mysql -u root -p

# Verify DATABASE_URL in .env.local
# Format: mysql://user:password@host:port/database

# Push schema
pnpm db:push
```

### Port Already in Use
```bash
# Use different port
PORT=3001 pnpm dev

# Or kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### AI Evolution Not Running
```bash
# Check status
curl http://localhost:3000/api/evolution/status

# Enable in .env.local
EVOLUTION_ENABLED=true

# Restart server
pnpm dev
```

### Analytics Not Showing Data
```bash
# Check analytics service
curl http://localhost:3000/api/analytics/status

# Verify events are being tracked
curl http://localhost:3000/api/analytics/events
```

---

## Performance Tuning

### Database Optimization
```bash
# Index key columns
pnpm db:index

# Analyze query performance
pnpm db:analyze
```

### Caching
```typescript
// Enable caching in config
CACHE_ENABLED=true
CACHE_TTL=3600  # 1 hour
CACHE_MAX_SIZE=1000  # items
```

### Load Balancing
```bash
# Run multiple instances
PORT=3000 pnpm start &
PORT=3001 pnpm start &
PORT=3002 pnpm start &

# Use nginx for load balancing
# See nginx.conf in deployment/
```

---

## Security Best Practices

### Change Default Secrets
```bash
# Generate new keys
openssl rand -base64 32  # For ENCRYPTION_KEY
openssl rand -base64 32  # For JWT_SECRET

# Update .env.local
ENCRYPTION_KEY=<new-key>
JWT_SECRET=<new-secret>
```

### Enable HTTPS
```bash
# In production, always use HTTPS
# Update .env.local
HTTPS=true
SSL_CERT=/path/to/cert.pem
SSL_KEY=/path/to/key.pem
```

### Rate Limiting
```bash
# Adjust rate limits
RATE_LIMIT=1000  # requests per minute
RATE_LIMIT_WINDOW=60  # seconds
```

---

## API Examples

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John"}'
```

### Send Message
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"roomId":"123","text":"Hello!"}'
```

### Get Analytics
```bash
curl http://localhost:3000/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"
```

---

## Support & Resources

### Documentation
- **Main Docs**: `UPGRADE_MANIFEST.md`
- **AI Features**: `EVOLUTION.md`
- **Presentation**: `PRESENTATION_SCRIPT.md`
- **API Docs**: `docs/api.md`

### Community
- **GitHub**: github.com/shadowchat/enterprise
- **Discord**: discord.gg/shadowchat
- **Email**: support@shadowchat.io

### Enterprise Support
- **Phone**: 1-800-SHADOW-1
- **Email**: enterprise@shadowchat.io
- **SLA**: 99.99% uptime guarantee

---

## Checklists

### Pre-Deployment
- [ ] Database configured and tested
- [ ] Environment variables set
- [ ] Security keys generated
- [ ] HTTPS certificate installed
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Load balancer configured
- [ ] DNS records updated

### Post-Deployment
- [ ] Health checks passing
- [ ] Metrics being collected
- [ ] Logs being aggregated
- [ ] Alerts configured
- [ ] Users can login
- [ ] Messages sending/receiving
- [ ] Analytics dashboard working
- [ ] Performance acceptable

---

## Next Steps

1. **Explore the Code**: Review the 9 new modules
2. **Read Documentation**: Check UPGRADE_MANIFEST.md
3. **Run Demo**: Start the dev server and explore
4. **Customize**: Modify components and features
5. **Deploy**: Follow deployment guide
6. **Monitor**: Watch metrics and logs
7. **Scale**: Add more instances as needed
8. **Optimize**: Use intelligent optimizer recommendations

---

**Version**: 111.0.0-enterprise  
**Last Updated**: June 2, 2026  
**Status**: Production Ready
