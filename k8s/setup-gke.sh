#!/bin/bash
# Run this once to set up GKE cluster and namespaces
# Usage: ./setup-gke.sh YOUR_PROJECT_ID

PROJECT_ID=$1
CLUSTER_NAME="reclamation-cluster"
ZONE="europe-west1-b"

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./setup-gke.sh YOUR_PROJECT_ID"
  exit 1
fi

echo "Setting up GKE for project: $PROJECT_ID"

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create GKE cluster (1 node pool, autoscaling 1-5)
gcloud container clusters create $CLUSTER_NAME \
  --zone $ZONE \
  --num-nodes 2 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 5 \
  --machine-type e2-standard-2

# Get credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE

# Create namespaces for each environment
kubectl create namespace reclamation-dev
kubectl create namespace reclamation-staging
kubectl create namespace reclamation-prod

echo ""
echo "Done! Now replace PROJECT_ID in k8s/base/*.yaml with: $PROJECT_ID"
echo ""
echo "Deploy commands:"
echo "  DEV:     kubectl apply -k k8s/overlays/dev"
echo "  STAGING: kubectl apply -k k8s/overlays/staging"
echo "  PROD:    kubectl apply -k k8s/overlays/prod"
