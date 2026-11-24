#!/usr/bin/env bash
set -euo pipefail

# Script update backend LapakPindah di VPS (aman: tidak menghapus data database).
# Pemakaian:
#   ./deploy.sh              # mode standar VPS (API + MySQL + Caddy HTTPS)
#   ./deploy.sh --no-caddy   # jika VPS sudah memakai Nginx/Caddy sendiri di port 80/443

USE_CADDY=true
if [[ "${1:-}" == "--no-caddy" ]]; then
  USE_CADDY=false
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
if [[ "$USE_CADDY" == true ]]; then
  docker compose --profile prod up -d --build
else
  docker compose up -d --build
fi

echo "==> 3. Menjalankan migrasi tabel (data lama aman)..."
docker compose exec -T api npm run db:migrate

PORT_VALUE=$(grep -E '^PORT=' .env | tail -n1 | cut -d '=' -f2- || true)
PORT_VALUE=${PORT_VALUE:-3000}

echo "==> 4. Cek kesehatan server..."
curl -fsS "http://127.0.0.1:${PORT_VALUE}/api/health"
echo ""
echo "Deploy selesai!"
