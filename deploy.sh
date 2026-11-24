#!/usr/bin/env bash
set -euo pipefail

# Script update backend LapakPindah di VPS (aman: tidak menghapus data database).
# Pemakaian:
#   ./deploy.sh              # mode standar VPS (API + MySQL Docker + Caddy HTTPS)
#   ./deploy.sh --no-caddy   # tanpa Caddy (VPS sudah punya Nginx/Caddy sendiri)
#   ./deploy.sh --host-db    # tanpa Caddy & memakai MySQL/MariaDB host VPS (mis. aaPanel)

MODE="full"
if [[ "${1:-}" == "--no-caddy" ]]; then
  MODE="no-caddy"
elif [[ "${1:-}" == "--host-db" ]]; then
  MODE="host-db"
fi

if [[ ! -f .env ]]; then
  echo "Error: file .env belum ada. Salin dari .env.example lalu isi nilainya." >&2
  exit 1
fi

echo "==> 1. Mengambil kode terbaru dari origin/main..."
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "==> 2. Membangun ulang dan menyalakan container..."
if [[ "$MODE" == "full" ]]; then
  docker compose --profile prod up -d --build
  echo "==> 3. Menjalankan migrasi tabel (data lama aman)..."
  docker compose exec -T api npm run db:migrate
elif [[ "$MODE" == "no-caddy" ]]; then
  docker compose up -d --build
  echo "==> 3. Menjalankan migrasi tabel (data lama aman)..."
  docker compose exec -T api npm run db:migrate
else
  docker compose -f docker-compose.yml -f docker-compose.host-db.yml up -d --build --no-deps api
  echo "==> 3. Menjalankan migrasi tabel (data lama aman)..."
  docker compose -f docker-compose.yml -f docker-compose.host-db.yml exec -T api npm run db:migrate
fi

PORT_VALUE=$(grep -E '^PORT=' .env | tail -n1 | cut -d '=' -f2- || true)
PORT_VALUE=${PORT_VALUE:-3000}

echo "==> 4. Cek kesehatan server..."
curl -fsS "http://127.0.0.1:${PORT_VALUE}/api/health"
echo ""
echo "Deploy selesai!"
