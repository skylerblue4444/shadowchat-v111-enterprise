#!/bin/bash

# ShadowChat v111 — Ultimate One-Click Deploy
# Supports: Vercel, Google Cloud, AWS, Docker, GitHub Pages
# Usage: ./deploy.sh [vercel|gcp|aws|docker|all]

set -e

VERSION=$(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="deploy_${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
  echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

header() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

deploy_all() {
  header "🚀 ShadowChat v111 — ULTIMATE DEPLOYMENT v$VERSION"
  
  log "📍 Deployment Log: $LOG_FILE"
  log "🕐 Timestamp: $TIMESTAMP"
  
  header "🔍 Pre-Flight Checks"
  
  if [ ! -d "node_modules" ]; then
    log "📦 Installing dependencies..."
    pnpm install --frozen-lockfile
    success "Dependencies installed"
  fi
  
  if [ ! -f ".env" ]; then
    warn ".env file not found. Creating from .env.example..."
    cp .env.example .env
    warn "⚠️  Update .env with your credentials before deploying!"
  fi
  
  header "🔨 Building for Production"
  log "Running: pnpm build"
  pnpm build
  success "Production build complete"
  
  header "🌐 Deploying to All Platforms"
  
  deploy_vercel
  deploy_gcp
  deploy_aws
  deploy_docker
  
  header "📊 Deployment Summary"
  log "✅ All deployments completed!"
  log "📍 Log file: $LOG_FILE"
  log "🎉 ShadowChat v111 is now LIVE!"
}

deploy_vercel() {
  header "⚡ Deploying to Vercel"
  
  if ! command -v vercel &> /dev/null; then
    warn "Vercel CLI not found. Skipping Vercel deployment."
    return
  fi
  
  log "Deploying to Vercel..."
  vercel deploy --prod --yes
  success "Deployed to Vercel"
}

deploy_gcp() {
  header "☁️  Deploying to Google Cloud Run"
  
  if ! command -v gcloud &> /dev/null; then
    warn "gcloud CLI not found. Skipping GCP deployment."
    return
  fi
  
  PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
  if [ -z "$PROJECT_ID" ]; then
    warn "No GCP project configured. Skipping GCP deployment."
    return
  fi
  
  log "Building Docker image for GCP..."
  docker build -t gcr.io/$PROJECT_ID/shadowchat-v111:$VERSION .
  docker tag gcr.io/$PROJECT_ID/shadowchat-v111:$VERSION gcr.io/$PROJECT_ID/shadowchat-v111:latest
  
  log "Pushing to Google Container Registry..."
  docker push gcr.io/$PROJECT_ID/shadowchat-v111:$VERSION
  docker push gcr.io/$PROJECT_ID/shadowchat-v111:latest
  
  log "Deploying to Cloud Run..."
  gcloud run deploy shadowchat-v111 \
    --image gcr.io/$PROJECT_ID/shadowchat-v111:$VERSION \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production \
    --quiet
  
  success "Deployed to Google Cloud Run"
}

deploy_aws() {
  header "☁️  Deploying to AWS"
  
  if ! command -v aws &> /dev/null; then
    warn "AWS CLI not found. Skipping AWS deployment."
    return
  fi
  
  AWS_REGION=${AWS_REGION:-us-east-1}
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
  
  if [ -z "$AWS_ACCOUNT_ID" ]; then
    warn "AWS not configured. Skipping AWS deployment."
    return
  fi
  
  ECR_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/shadowchat-v111"
  
  log "Creating ECR repository (if needed)..."
  aws ecr describe-repositories --repository-names shadowchat-v111 --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name shadowchat-v111 --region $AWS_REGION
  
  log "Logging in to ECR..."
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
  
  log "Building and pushing Docker image to ECR..."
  docker build -t $ECR_REPO:$VERSION .
  docker tag $ECR_REPO:$VERSION $ECR_REPO:latest
  docker push $ECR_REPO:$VERSION
  docker push $ECR_REPO:latest
  
  success "Pushed to AWS ECR: $ECR_REPO:$VERSION"
}

deploy_docker() {
  header "🐳 Building Docker Image"
  
  if ! command -v docker &> /dev/null; then
    warn "Docker not found. Skipping Docker build."
    return
  fi
  
  log "Building Docker image..."
  docker build -t shadowchat-v111:$VERSION .
  docker tag shadowchat-v111:$VERSION shadowchat-v111:latest
  
  success "Docker image built: shadowchat-v111:$VERSION"
  log "To run locally: docker run -p 3000:3000 shadowchat-v111:latest"
}

show_usage() {
  echo ""
  echo "🚀 ShadowChat v111 — One-Click Deploy"
  echo ""
  echo "Usage: ./deploy.sh [target]"
  echo ""
  echo "Targets:"
  echo "  vercel    - Deploy to Vercel (fastest)"
  echo "  gcp       - Deploy to Google Cloud Run"
  echo "  aws       - Deploy to AWS ECR"
  echo "  docker    - Build Docker image"
  echo "  all       - Deploy to all platforms (default)"
  echo ""
}

TARGET=${1:-all}

case $TARGET in
  vercel)
    header "⚡ Deploying to Vercel"
    pnpm build
    deploy_vercel
    ;;
  gcp)
    header "☁️  Deploying to Google Cloud"
    pnpm build
    deploy_gcp
    ;;
  aws)
    header "☁️  Deploying to AWS"
    pnpm build
    deploy_aws
    ;;
  docker)
    header "🐳 Building Docker Image"
    pnpm build
    deploy_docker
    ;;
  all)
    deploy_all
    ;;
  *)
    error "Unknown target: $TARGET"
    show_usage
    exit 1
    ;;
esac

success "Deployment complete! 🎉"
