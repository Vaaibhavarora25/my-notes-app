#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/.logs"
mkdir -p "$LOG_DIR"

PIDS=()

kill_node_on_port() {
  local port="$1"

  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command "
      \$conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
      foreach (\$conn in \$conns) {
        \$proc = Get-Process -Id \$conn.OwningProcess -ErrorAction SilentlyContinue
        if (\$proc -and \$proc.ProcessName -eq 'node') {
          Stop-Process -Id \$proc.Id -Force -ErrorAction SilentlyContinue
        }
      }
    " >/dev/null 2>&1 || true
  fi
}

prepare_runtime() {
  echo "[setup] Cleaning stale local runtime state..."

  # Remove stale Next.js dev lock from previous interrupted runs.
  rm -f "$ROOT_DIR/frontend/.next/dev/lock" 2>/dev/null || true

  # Free expected local dev ports from stale Node processes.
  kill_node_on_port 3000
  kill_node_on_port 3001
  kill_node_on_port 3002
  kill_node_on_port 3003
  kill_node_on_port 3004
}

start_process() {
  local name="$1"
  local dir="$2"
  local cmd="$3"

  echo "[start] $name"
  (
    cd "$dir"
    bash -lc "$cmd"
  ) >"$LOG_DIR/$name.log" 2>&1 &

  local pid=$!
  PIDS+=("$pid")
  echo "[pid] $name => $pid (log: .logs/$name.log)"
}

cleanup() {
  echo
  echo "[stop] Shutting down all processes..."
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
}

trap cleanup EXIT INT TERM

echo "[setup] Checking dependencies..."
if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
  (cd "$ROOT_DIR/backend" && npm install)
fi
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  (cd "$ROOT_DIR/frontend" && npm install)
fi

prepare_runtime

echo "[setup] Generating Prisma clients..."
(cd "$ROOT_DIR/backend" && npm run prisma:generate:all)

echo "[setup] Syncing local database schema..."
(cd "$ROOT_DIR/backend" && npm run db:setup:local)

start_process "user-service" "$ROOT_DIR/backend" "npm run start:dev:users"
sleep 1
start_process "notes-service" "$ROOT_DIR/backend" "npm run start:dev:notes"
sleep 1
start_process "queue-service" "$ROOT_DIR/backend" "npm run start:dev:queue"
sleep 1
start_process "api-gateway" "$ROOT_DIR/backend" "npm run start:dev"
sleep 1
start_process "frontend" "$ROOT_DIR/frontend" "npm run dev -- --port 3000"

echo
echo "Application is starting..."
echo "Frontend:     http://localhost:3000"
echo "API Gateway:  http://localhost:3001"
echo "Swagger Docs: http://localhost:3001/docs"
echo
echo "Logs are written to .logs/"
echo "Press Ctrl+C to stop all services."

while true; do
  for pid in "${PIDS[@]}"; do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo "[error] A process exited unexpectedly. Check .logs for details."
      exit 1
    fi
  done
  sleep 2
done
