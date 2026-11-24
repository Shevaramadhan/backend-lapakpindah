# Panduan Deploy Backend ke VPS (Docker Compose)

Panduan ini menjelaskan cara men-deploy `lapakpindah-backend` ke VPS Linux (Ubuntu 22.04/24.04) menggunakan **Docker Compose** (Express API + MySQL 8.4 + Caddy untuk HTTPS otomatis).

---

## 1. Prasyarat di VPS

1. Akses SSH ke VPS (`ssh user@<IP-VPS>`).
2. Docker & Docker Compose v2 sudah terpasang. Jika belum, pasang di Ubuntu:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   # logout lalu login SSH lagi agar grup docker aktif
   docker compose version
   ```
3. Port firewall terbuka untuk HTTP/HTTPS (dan SSH agar tidak terkunci):
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 443/udp
   ```
   *(Pastikan juga Security Group / Firewall di panel cloud penyedia VPS membuka port 80 dan 443).*

---

## 2. Deploy pertama kali

```bash
# 1. Clone repo backend di VPS
git clone https://github.com/Shevaramadhan/backend-lapakpindah.git lapakpindah-backend
cd lapakpindah-backend

# 2. Buat file .env dari contoh
cp .env.example .env
```

Edit `.env` (`nano .env`) dan **wajib** isi nilai yang kuat untuk produksi:

```env
PORT=3000

DB_USER=lapakpindah
DB_PASSWORD=<buat-password-mysql-yang-kuat>
DB_ROOT_PASSWORD=<buat-password-root-mysql-yang-kuat>
DB_NAME=lapakpindah

# Generate acak dengan perintah: openssl rand -hex 32
JWT_SECRET=<hasil-openssl-rand-hex-32>
JWT_EXPIRES_IN=30d

# Opsi A: Punya domain sendiri (arahkan A record domain ke IP VPS terlebih dahulu)
DOMAIN=api.lapakpindah.my.id

# Opsi B: Belum punya domain → pakai sslip.io agar tetap dapat HTTPS otomatis!
# Ganti 103.123.45.67 dengan IP publik VPS Anda:
# DOMAIN=103.123.45.67.sslip.io

API_BIND_HOST=127.0.0.1
```

Lalu nyalakan stack dan inisialisasi database:

```bash
# 3. Build dan nyalakan db + api + caddy (HTTPS otomatis)
docker compose --profile prod up -d --build

# 4. Buat semua tabel dan isi data demo awal
docker compose exec api npm run db:migrate
docker compose exec api npm run db:seed

# 5. Verifikasi server hidup dan database tersambung
curl https://<DOMAIN-ANDA>/api/health
# Harus menampilkan: {"status":"ok","database":"connected"}
```

> **Catatan jika di VPS sudah ada Nginx/Caddy lain yang memakai port 80/443:**
> Jalankan tanpa `--profile prod`:
> ```bash
> docker compose up -d --build
> docker compose exec api npm run db:migrate
> docker compose exec api npm run db:seed
> ```
> Lalu arahkan reverse proxy yang sudah ada di VPS ke `http://127.0.0.1:3000`.

---

## 3. Update VPS setiap ada Pull Request masuk ke `main`

Setiap kali Koordinator me-merge PR anggota ke branch `main` di repo `backend-lapakpindah`, cukup jalankan di VPS:

```bash
cd ~/lapakpindah-backend
./deploy.sh
```

*(Jika tidak memakai Caddy bawaan, jalankan `./deploy.sh --no-caddy`.)*

Script `deploy.sh` akan:
1. `git pull --ff-only origin main`
2. Build ulang & restart container `api`
3. Menjalankan `npm run db:migrate` (aman, data lama tidak dihapus)
4. Mengecek `/api/health`

Jika ada perubahan struktur kolom tabel dan database demo perlu di-reset total (hati-hati, **menghapus semua data**):
```bash
docker compose exec api npm run db:fresh
```

---

## 4. Perintah berguna saat memantau VPS

```bash
# Lihat status semua container
docker compose --profile prod ps

# Lihat log API secara real-time
docker compose logs -f api

# Lihat log Caddy (untuk cek sertifikat HTTPS Let's Encrypt)
docker compose --profile prod logs -f caddy

# Tes login dari terminal
curl -X POST https://<DOMAIN-ANDA>/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"081234567890","pin":"123456"}'
```

---

## 5. Menghubungkan aplikasi Flutter ke VPS

Server VPS Kelompok 8 sudah aktif di:
- Health check: `https://lapakpindah.43-157-229-215.sslip.io/api/health`
- API Base URL: `https://lapakpindah.43-157-229-215.sslip.io/api/v1`
- Lokasi di VPS: `/opt/lapakpindah-backend` (Nginx reverse proxy → `127.0.0.1:3000`, MySQL container di host `127.0.0.1:3307`, update dengan `./deploy.sh --no-caddy`)

Semua anggota bisa menjalankan Flutter langsung ke server VPS:

```bash
flutter run --dart-define=API_BASE_URL=https://lapakpindah.43-157-229-215.sslip.io/api/v1
```

Login demo: `081234567890` / PIN `123456`.
