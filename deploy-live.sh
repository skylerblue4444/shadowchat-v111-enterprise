#!/bin/bash

# ShadowChat v111 — One-Click Live Deployment
# Supports: Google Cloud, AWS, Vercel, Docker
# Usage: ./deploy-live.sh [gcp|aws|vercel|docker]

set -e

DEPLOY_TARGET=${1:-gcp}
ENVIRONMENT="production"
PROJECT_NAME="shadowchat-v111"
VERSION=$(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)

echo ""
echo "🚀 ShadowChat v111 — LIVE DEPLOYMENT (Beta)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Version: $VERSION"
echo "🎯 Target: $DEPLOY_TARGET"
echo "🌍 Environment: $ENVIRONMENT"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install --frozen-lockfile
fi

# Build for production
echo "🔨 Building for production..."
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

echo "✅ Build successful"
echo ""

case $DEPLOY_TARGET in
  gcp)
    deploy_gcp
    ;;
  aws)
    deploy_aws
    ;;
  vercel)
    deploy_vercel
    ;;
  docker)
    deploy_docker
    ;;
  *)
    echo "❌ Unknown deployment target: $DEPLOY_TARGET"
    echo "Available options: gcp, aws, vercel, docker"
    exit 1
    ;;
esac

echo ""
echo "✅ Deployment complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

deploy_gcp() {
  echo "🌐 Deploying to Google Cloud Platform..."
  echo ""
  
  if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
  fi

  PROJECT_ID=$(gcloud config get-value project)
  
  if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project configured. Run: gcloud config set project PROJECT_ID"
    exit 1
  fi

  echo "📍 GCP Project: $PROJECT_ID"
  echo ""
  
  # Build Docker image
  echo "🐳 Building Docker image..."
  docker build -t gcr.io/$PROJECT_ID/$PROJECT_NAME:$VERSION .
  docker tag gcr.io/$PROJECT_ID/$PROJECT_NAME:$VERSION gcr.io/$PROJECT_ID/$PROJECT_NAME:latest

  # Push to Container Registry
  echo "📤 Pushing to Google Container Registry..."
  docker push gcr.io/$PROJECT_ID/$PROJECT_NAME:$VERSION
  docker push gcr.io/$PROJECT_ID/$PROJECT_NAME:latest

  # Deploy to Cloud Run
  echo "🚀 Deploying to Cloud Run..."
  gcloud run deploy $PROJECT_NAME \
    --image gcr.io/$PROJECT_ID/$PROJECT_NAME:$VERSION \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production

  SERVICE_URL=$(gcloud run services describe $PROJECT_NAME --platform managed --region us-central1 --format 'value(status.url)')
  
  echo ""
  echo "✅ Deployed to Google Cloud Run!"
  echo "🌐 URL: $SERVICE_URL"
}

deploy_aws() {
  echo "☁️  Deploying to Amazon Web Services..."
  echo ""
  
  if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install from: https://aws.amazon.com/cli/"
    exit 1
  fi

  AWS_REGION=${AWS_REGION:-us-east-1}
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  ECR_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT_NAME"

  echo "📍 AWS Account: $AWS_ACCOUNT_ID"
  echo "📍 AWS Region: $AWS_REGION"
  echo ""

  # Create ECR repository if it doesn't exist
  aws ecr describe-repositories --repository-names $PROJECT_NAME --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $PROJECT_NAME --region $AWS_REGION

  # Login to ECR
  echo "🔐 Logging in to ECR..."
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

  # Build and push Docker image
  echo "🐳 Building and pushing Docker image..."
  docker build -t $ECR_REPO:$VERSION .
  docker tag $ECR_REPO:$VERSION $ECR_REPO:latest
  docker push $ECR_REPO:$VERSION
  docker push $ECR_REPO:latest

  # Deploy to ECS (Fargate)
  echo "🚀 Deploying to AWS ECS Fargate..."
  echo "Note: Ensure you have an ECS cluster and task definition configured."
  echo "Task definition should reference: $ECR_REPO:$VERSION"
  
  echo ""
  echo "✅ Docker image pushed to ECR!"
  echo "📍 ECR URI: $ECR_REPO:$VERSION"
  echo "Next: Configure your ECS service to use this image"
}

deploy_vercel() {
  echo "⚡ Deploying to Vercel..."
  echo ""
  
  if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install: npm i -g vercel"
    exit 1
  fi

  vercel deploy --prod

  echo ""
  echo "✅ Deployed to Vercel!"
}

deploy_docker() {
  echo "🐳 Building Docker image..."
  echo ""
  
  if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install from: https://www.docker.com/products/docker-desktop"
    exit 1
  fi

  DOCKER_IMAGE="$PROJECT_NAME:$VERSION"
  
  docker build -t $DOCKER_IMAGE .
  docker tag $DOCKER_IMAGE $PROJECT_NAME:latest

  echo ""
  echo "✅ Docker image built successfully!"
  echo "📍 Image: $DOCKER_IMAGE"
  echo ""
  echo "To run locally:"
  echo "  docker run -p 3000:3000 $DOCKER_IMAGE"
  echo ""
  echo "To push to Docker Hub:"
  echo "  docker tag $DOCKER_IMAGE YOUR_USERNAME/$PROJECT_NAME:$VERSION"
  echo "  docker push YOUR_USERNAME/$PROJECT_NAME:$VERSION"
}

# Run the deployment
case $DEPLOY_TARGET in
  gcp) deploy_gcp ;;
  aws) deploy_aws ;;
  vercel) deploy_vercel ;;
  docker) deploy_docker ;;
esac
