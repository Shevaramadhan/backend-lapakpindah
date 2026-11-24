# LapakPindah Backend

REST API LapakPindah dengan **Express 5** dan **MySQL** (repository terpisah dari aplikasi mobile Flutter `mobile-lapakpindah`).

- Daftar endpoint dan bentuk JSON (Kontrak API): [docs/api/kontrak-api.md](docs/api/kontrak-api.md)
- Panduan kerja kelompok & integrasi Flutter: tersedia di repo mobile (`lapakpindah/docs/PANDUAN_BACKEND_KELOMPOK.md`)

## Menjalankan di laptop

Yang dibutuhkan: Node.js 20+ dan MySQL/MariaDB yang menyala (XAMPP atau Laragon).

```bash
git clone https://github.com/Shevaramadhan/backend-lapakpindah.git lapakpindah-backend
cd lapakpindah-backend
npm install
copy .env.example .env    # Mac/Linux: cp .env.example .env
# isi DB_USER, DB_PASSWORD, DB_PORT di .env
npm run db:fresh          # buat database + semua tabel + data demo
npm run dev               # http://localhost:3000, restart otomatis saat file berubah
```

Cek `http://localhost:3000/api/health`. Harus tampil `"database": "connected"`.

| Perintah | Gunanya |
|---|---|
| `npm run dev` | Menyalakan server (mode pengembangan) |
| `npm test` | Menjalankan semua tes di `test/` |
| `npm run db:migrate` | Membuat tabel yang belum ada. Data lama tetap |
| `npm run db:seed` | Mengisi data demo (aman diulang) |
| `npm run db:fresh` | **Menghapus** database lalu membuat ulang + data demo. Pakai setelah ada perubahan kolom |

Akun demo: `081234567890` / PIN `123456`.

## Mencoba endpoint

Semua endpoint kecuali login butuh token. Di Git Bash:

```bash
# 1. Login, salin nilai "token" dari jawabannya
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"081234567890","pin":"123456"}'

# 2. Pakai token
TOKEN=<token-tadi>
curl http://localhost:3000/api/v1/locations -H "Authorization: Bearer $TOKEN"
curl http://localhost:3000/api/v1/sessions/active -H "Authorization: Bearer $TOKEN"
```

Bisa juga dengan Postman atau ekstensi VS Code "Thunder Client": isi tab
Auth → Bearer Token.

## Struktur folder

```
lapakpindah-backend/
  docs/
    api/kontrak-api.md         kontrak API bersama (single source of truth)
  database/
    schema/
      00_auth.sql              Koordinator
      01_sesi_lokasi.sql       Anggota 1
      02_pengeluaran.sql       Anggota 2
      03_penjualan.sql         Anggota 3
      04_evaluasi_lokasi.sql   Anggota 4
    seeds/demo.sql             data demo bersama (Koordinator)
    migrate.js, seed.js
  src/
    server.js                  menyalakan server
    app.js                     mendaftarkan semua modul (Koordinator)
    config/                    .env dan koneksi MySQL
    middleware/                login (JWT) dan penanganan error
    shared/                    pembantu bersama: validasi, sesi aktif, upload foto
    modules/
      auth/                    login (Koordinator)                  ✅
      sesi_lokasi/             Modul 1 — locations ✅, sessions/active ✅
      pengeluaran/             Modul 2
      penjualan/               Modul 3
      evaluasi_lokasi/         Modul 4
  test/<modul>/                tes per modul
```

### Branch modul di repo ini

Gunakan nama branch yang sama dengan repo mobile agar konsisten:

| Anggota | Branch | Folder yang dikerjakan |
|---|---|---|
| Anggota 1 | `modul1-lokasi-sesijualan` | `src/modules/sesi_lokasi/`, `database/schema/01_sesi_lokasi.sql`, `test/sesi_lokasi/` |
| Anggota 2 | `modul-2-pengeluaran` | `src/modules/pengeluaran/`, `database/schema/02_pengeluaran.sql`, `test/pengeluaran/` |
| Anggota 3 | `modul3-pencatatan-penjualan` | `src/modules/penjualan/`, `database/schema/03_penjualan.sql`, `test/penjualan/` |
| Anggota 4 | `modul4-evaluasi-lokasi` | `src/modules/evaluasi_lokasi/`, `database/schema/04_evaluasi_lokasi.sql`, `test/evaluasi_lokasi/` |

Alur satu request: **route (`index.js`) → controller → validator →
repository → MySQL**, sama seperti View → ViewModel → Repository di Flutter.

## Mengakses dari HP

- Kabel USB: `adb reverse tcp:3000 tcp:3000`, lalu aplikasi memakai
  `http://localhost:3000/api/v1`.
- Wi-Fi yang sama: pakai IP laptop dari `ipconfig`, misalnya
  `http://192.168.1.10:3000/api/v1`, lalu izinkan Node.js di Windows Firewall.

Build debug Android sudah diizinkan memakai `http://`. Build rilis wajib `https://`.

## Belum dikerjakan

- Endpoint modul yang bertanda ⏳ di kontrak API.
- Deploy ke server online (VPS + HTTPS).
