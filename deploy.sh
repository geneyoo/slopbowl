#!/bin/bash
# Deploy SlopBowl Discord bot to a remote host over SSH.
#
# Required env:
#   SLOPBOWL_SERVER     SSH target, e.g. user@host
#
# Optional env:
#   SLOPBOWL_REMOTE_DIR Remote install path (default: ~/slopbowl)
#   SLOPBOWL_ENV_FILE   Local env file to copy (default: packages/discord-bot/.env)

set -euo pipefail

: "${SLOPBOWL_SERVER:?SLOPBOWL_SERVER is required (e.g. user@host)}"
REMOTE_DIR="${SLOPBOWL_REMOTE_DIR:-~/slopbowl}"
ENV_FILE="${SLOPBOWL_ENV_FILE:-packages/discord-bot/.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "env file not found: $ENV_FILE" >&2
  exit 1
fi

npm run typecheck
npm run build
npm test

ssh "$SLOPBOWL_SERVER" "mkdir -p $REMOTE_DIR/packages/discord-bot"
rsync -az --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude "dist" \
  --exclude ".env*" \
  ./ "$SLOPBOWL_SERVER:$REMOTE_DIR/"
scp "$ENV_FILE" "$SLOPBOWL_SERVER:$REMOTE_DIR/packages/discord-bot/.env"
ssh "$SLOPBOWL_SERVER" "cd $REMOTE_DIR && docker compose up -d --build"
ssh "$SLOPBOWL_SERVER" "cd $REMOTE_DIR && docker compose logs --tail 30"
