#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPO:-fahad4787/Alpha-60-Gym-Managment}"
ENV_FILE="${1:-.env.production}"

if ! command -v gh >/dev/null2>&1; then
  echo "Install GitHub CLI: https://cli.github.com/ then run: gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "File not found: $ENV_FILE (copy from .env.example and fill, or pass path as first argument)"
  exit 1
fi

while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line//$'\r'/}"
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line// }" ]] && continue
  name="${line%%=*}"
  value="${line#*=}"
  [[ "$name" != VITE_* ]] && continue
  if [[ -z "$value" ]]; then
    echo "Skip empty: $name"
    continue
  fi
  echo "Setting secret: $name"
  gh secret set "$name" --repo "$REPO" --body "$value"
done < "$ENV_FILE"

echo "Done. Re-run the Deploy workflow on GitHub (Actions tab)."
