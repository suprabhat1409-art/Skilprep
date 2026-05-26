# SkilPrep — Deployment & CI Guide

This document explains the GitHub Actions CI workflow and how to configure GitHub Container Registry (GHCR) for automatic image publishing.

## CI workflow
- Location: `.github/workflows/ci.yml`
- Runs on pushes and pull requests targeting `main`.
- Steps:
  - Checkout repository and setup Node.js 18
  - Install and build the `client` (runs lint and `npm run build`)
  - Install server dependencies
  - Build Docker images for `server` and `client`
  - Upload `client/dist` as an artifact (for debugging)
  - On `main`, login to GHCR and push the built images

## Configure GHCR (GitHub Container Registry)
1. No extra secret is required for pushing to GHCR from Actions; the workflow uses `GITHUB_TOKEN`.
2. If you prefer a personal PAT: create a token with `write:packages` and `read:packages`, then add it to repository secrets as `GHCR_TOKEN` and update the workflow to use it.
3. Images are pushed to: `ghcr.io/<owner>/skilprep-server` and `ghcr.io/<owner>/skilprep-client`.

## Required repository secrets & settings
- `GITHUB_TOKEN` (provided automatically to Actions)
- For production deployments, configure environment secrets at your host provider (e.g., `MONGO_URI`, `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).

## How to change the workflow
- Edit `.github/workflows/ci.yml` to:
  - Add test steps before building images.
  - Change image registry or tags.
  - Add deployment steps (e.g., SSH deploy, Render deploy, or GitHub Releases).

## Quick local testing of Docker
Build and run locally with Docker Compose (uses local MongoDB volume):
```bash
docker compose up -d --build
# Stop and remove
docker compose down -v
```

## Notes
- Remove demo credentials before sharing publicly.
- For production, use an external MongoDB (Atlas) and S3 for uploads; update `MONGO_URI` and storage code accordingly.

## Deploying to Render (recommended)

Render is a managed hosting platform that supports automatic deploys and is easy to integrate with GitHub Actions.

1. Create two Web Services on Render: one for the `server` (Docker/Node) and one for the `client` (Static Site / Docker). Configure each service to use the correct Dockerfile or build command.
2. In your GitHub repository, add these repository secrets:
  - `RENDER_API_KEY` — create an API key in Render (Service Account/API Keys) and copy it into GitHub Secrets.
  - `RENDER_SERVER_SERVICE_ID` — the Render service ID for the server service.
  - `RENDER_CLIENT_SERVICE_ID` — the Render service ID for the client service.
3. The CI workflow will trigger a Render deploy on successful pushes to `main` using these secrets. The deploy step uses the Render API to create a deploy and clear the cache.

If you prefer another host (Fly, AWS, or DigitalOcean), I can add deployment steps for that provider as well.
