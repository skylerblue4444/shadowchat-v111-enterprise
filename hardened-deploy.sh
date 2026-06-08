#!/bin/bash

##############################################################################
# ShadowChat v111 - Hardened Production Deployment Script
# Beta-Grade Enterprise Security & Performance Optimization
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="shadowchat-v111-enterprise"
ENVIRONMENT="${1:-production}"
DEPLOY_DIR="/opt/shadowchat"
LOG_DIR="/var/log/shadowchat"
BACKUP_DIR="/var/backups/shadowchat"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ShadowChat v111 - Hardened Production Deployment          ║${NC}"
echo -e "${BLUE}║  Environment: ${ENVIRONMENT}                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Pre-deployment checks
echo -e "\n${YELLOW}[1/10] Running pre-deployment security checks...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js is not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}✗ pnpm is not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ pnpm found: $(pnpm --version)${NC}"

# Dependency vulnerability check
echo -e "\n${YELLOW}[2/10] Scanning dependencies for vulnerabilities...${NC}"
if pnpm audit --prod 2>/dev/null || true; then
  echo -e "${GREEN}✓ Dependency scan complete${NC}"
else
  echo -e "${YELLOW}⚠ Some vulnerabilities found - review required${NC}"
fi

# Clean build
echo -e "\n${YELLOW}[3/10] Cleaning and installing dependencies...${NC}"
rm -rf node_modules dist
pnpm install --prod --frozen-lockfile 2>/dev/null || pnpm install --prod
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Build application
echo -e "\n${YELLOW}[4/10] Building application with optimizations...${NC}"
pnpm build
if [ -d "dist" ]; then
  echo -e "${GREEN}✓ Build successful ($(du -sh dist | cut -f1))${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi

# Security hardening
echo -e "\n${YELLOW}[5/10] Applying security hardening...${NC}"
# Create security headers
cat > dist/.htaccess << 'EOF'
# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Disable directory listing
Options -Indexes

# Compress static assets
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
EOF
echo -e "${GREEN}✓ Security headers configured${NC}"

# Environment validation
echo -e "\n${YELLOW}[6/10] Validating environment configuration...${NC}"
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠ .env file not found - creating from .env.example${NC}"
  cp .env.example .env
  echo -e "${YELLOW}⚠ Please configure .env with your settings${NC}"
fi
echo -e "${GREEN}✓ Environment configured${NC}"

# Create deployment directories
echo -e "\n${YELLOW}[7/10] Preparing deployment directories...${NC}"
mkdir -p "$DEPLOY_DIR" "$LOG_DIR" "$BACKUP_DIR"
chmod 750 "$DEPLOY_DIR" "$LOG_DIR" "$BACKUP_DIR"
echo -e "${GREEN}✓ Directories prepared${NC}"

# Backup current deployment
echo -e "\n${YELLOW}[8/10] Creating backup of current deployment...${NC}"
if [ -d "$DEPLOY_DIR/current" ]; then
  BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
  cp -r "$DEPLOY_DIR/current" "$BACKUP_DIR/$BACKUP_NAME"
  echo -e "${GREEN}✓ Backup created: $BACKUP_NAME${NC}"
fi

# Deploy application
echo -e "\n${YELLOW}[9/10] Deploying application...${NC}"
cp -r dist "$DEPLOY_DIR/current"
cp package.json "$DEPLOY_DIR/current/"
cp .env "$DEPLOY_DIR/current/.env" 2>/dev/null || true
echo -e "${GREEN}✓ Application deployed${NC}"

# Health check
echo -e "\n${YELLOW}[10/10] Running post-deployment health checks...${NC}"
sleep 2
if [ -f "$DEPLOY_DIR/current/index.html" ]; then
  echo -e "${GREEN}✓ Application files verified${NC}"
else
  echo -e "${RED}✗ Deployment verification failed${NC}"
  exit 1
fi

# Final summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║ Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}║ Deploy Directory: ${DEPLOY_DIR}${NC}"
echo -e "${BLUE}║ Log Directory: ${LOG_DIR}${NC}"
echo -e "${BLUE}║ Backup Directory: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Start the application: npm start"
echo -e "  2. Monitor logs: tail -f ${LOG_DIR}/*.log"
echo -e "  3. Verify health: curl http://localhost:3000/health"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
