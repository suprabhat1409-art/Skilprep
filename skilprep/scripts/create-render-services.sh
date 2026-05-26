#!/usr/bin/env bash
set -euo pipefail

# Create Render services for this repository using the Render API.
# Usage:
#   export RENDER_API_KEY="<your-render-api-key>"
#   export GITHUB_REPO="owner/repo"      # e.g. suprabhat/skilprep
#   export GITHUB_BRANCH="main"          # branch to deploy from
#   ./scripts/create-render-services.sh

if [ -z "${RENDER_API_KEY:-}" ] || [ -z "${GITHUB_REPO:-}" ]; then
  echo "ERROR: set RENDER_API_KEY and GITHUB_REPO environment variables first."
  exit 2
fi

GITHUB_BRANCH=${GITHUB_BRANCH:-main}

API="https://api.render.com/v1/services"

echo "Creating server service on Render (skilprep-server)..."
read -r -d '' SERVER_PAYLOAD <<'JSON'
{
  "service": {
    "name": "skilprep-server",
    "type": "web_service",
    "repo": { "name": "__GITHUB_REPO__" },
    "branch": "__GITHUB_BRANCH__",
    "env": "node",
    "plan": "starter",
    "disk": 1,
    "buildCommand": "cd server && npm ci",
    "startCommand": "cd server && npm run start",
    "healthCheckPath": "/"
  }
}
JSON

SERVER_PAYLOAD=${SERVER_PAYLOAD//__GITHUB_REPO__/${GITHUB_REPO}}
SERVER_PAYLOAD=${SERVER_PAYLOAD//__GITHUB_BRANCH__/${GITHUB_BRANCH}}

echo "Requesting Render API to create server service..."
curl -sS -X POST "$API" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$SERVER_PAYLOAD" | jq .

echo
echo "Creating client service on Render (skilprep-client)..."
read -r -d '' CLIENT_PAYLOAD <<'JSON'
{
  "service": {
    "name": "skilprep-client",
    "type": "static_site",
    "repo": { "name": "__GITHUB_REPO__" },
    "branch": "__GITHUB_BRANCH__",
    "buildCommand": "cd client && npm ci && npm run build",
    "publishPath": "client/dist",
    "plan": "starter"
  }
}
JSON

CLIENT_PAYLOAD=${CLIENT_PAYLOAD//__GITHUB_REPO__/${GITHUB_REPO}}
CLIENT_PAYLOAD=${CLIENT_PAYLOAD//__GITHUB_BRANCH__/${GITHUB_BRANCH}}

echo "Requesting Render API to create client service..."
curl -sS -X POST "$API" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$CLIENT_PAYLOAD" | jq .

echo
echo "Done. If creation succeeded, note the returned service ids and add them as GitHub Secrets:
  RENDER_SERVER_SERVICE_ID
  RENDER_CLIENT_SERVICE_ID
Then you can push to main and the CI will trigger deploys."
