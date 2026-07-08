#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="$ROOT_DIR/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env.local at: $ENV_FILE" >&2
  echo "Create it from .env.local.example" >&2
  exit 1
fi

# Load KEY=VALUE pairs from .env.local into environment.
# Supports simple unquoted or double/single-quoted values.
load_env_file() {
  local file="$1"
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Strip CRLF
    line="${line%$'\r'}"

    # Ignore comments/blank lines
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue

    # Allow leading/trailing whitespace around assignment
    if [[ ! "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=(.*)$ ]]; then
      continue
    fi

    local key="${BASH_REMATCH[1]}"
    local raw="${BASH_REMATCH[2]}"

    # Trim surrounding whitespace
    raw="${raw#${raw%%[![:space:]]*}}"
    raw="${raw%${raw##*[![:space:]]}}"

    # Strip matching quotes
    if [[ "$raw" =~ ^"(.*)"$ ]]; then
      raw="${BASH_REMATCH[1]}"
    elif [[ "$raw" =~ ^'(.*)'$ ]]; then
      raw="${BASH_REMATCH[1]}"
    fi

    export "$key=$raw"
  done < "$file"
}

load_env_file "$ENV_FILE"

: "${SSH_TARGET:?Missing SSH_TARGET in .env.local}"
: "${LOCAL_DB_TUNNEL_PORT:?Missing LOCAL_DB_TUNNEL_PORT in .env.local}"

# If STAMPS_DB_PORT isn't set, default to LOCAL_DB_TUNNEL_PORT.
export STAMPS_DB_PORT="${STAMPS_DB_PORT:-$LOCAL_DB_TUNNEL_PORT}"

PHP_HOST="${PHP_HOST:-127.0.0.1}"
PHP_PORT="${PHP_PORT:-8080}"

SSH_CTL_SOCKET="${SSH_CTL_SOCKET:-/tmp/jamison_stamps_tunnel_${LOCAL_DB_TUNNEL_PORT}.sock}"
SSH_CONNECT_TIMEOUT="${SSH_CONNECT_TIMEOUT:-10}"
SSH_ALLOW_PASSWORD_PROMPT="${SSH_ALLOW_PASSWORD_PROMPT:-0}"

SSH_OPTS=(
  -M
  -S "$SSH_CTL_SOCKET"
  -o ExitOnForwardFailure=yes
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=3
  -o ConnectTimeout="$SSH_CONNECT_TIMEOUT"
)

# The VS Code background task should not block on interactive SSH prompts.
if [[ "$SSH_ALLOW_PASSWORD_PROMPT" != "1" ]]; then
  SSH_OPTS+=( -o BatchMode=yes )
fi

cleanup() {
  if [[ -S "$SSH_CTL_SOCKET" ]]; then
    ssh -S "$SSH_CTL_SOCKET" -O exit "$SSH_TARGET" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

echo "Opening SSH tunnel"

# Tunnel local port -> remote 127.0.0.1:3306
# Use ControlMaster so we can cleanly close the tunnel on exit.
if ! ssh "${SSH_OPTS[@]}" -f -N -L "${LOCAL_DB_TUNNEL_PORT}:127.0.0.1:3306" "${SSH_TARGET}"; then
  echo "ERROR: Could not open SSH tunnel to ${SSH_TARGET}." >&2
  if [[ "$SSH_ALLOW_PASSWORD_PROMPT" != "1" ]]; then
    echo "Hint: this task runs non-interactively in WSL and requires key-based SSH auth." >&2
    echo "Try: ssh ${SSH_TARGET}" >&2
    echo "If prompted for a password, set up SSH keys or run with SSH_ALLOW_PASSWORD_PROMPT=1." >&2
  fi
  exit 1
fi

# Optionally open the browser (the VS Code task sets OPEN_BROWSER=1)
if [[ "${OPEN_BROWSER:-}" == "1" ]]; then
  url="http://${PHP_HOST}:${PHP_PORT}/"
  echo "Open this URL in your browser: $url"
  if command -v wslview >/dev/null 2>&1; then
    wslview "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$url" >/dev/null 2>&1 || true
  fi
fi

# If another PHP dev server is already bound to this port, keep the tunnel alive
# instead of exiting (which would trigger cleanup and close the tunnel).
if command -v ss >/dev/null 2>&1 && ss -ltn | grep -q "[.:]${PHP_PORT}[[:space:]]"; then
  echo "PHP server port ${PHP_PORT} is already in use; keeping DB tunnel open only."
  echo "Press Ctrl+C to close the tunnel."
  tail -f /dev/null
else
  php -S "${PHP_HOST}:${PHP_PORT}" -t .
fi
