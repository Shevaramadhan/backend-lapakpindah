# Kontrak API LapakPindah

Dokumen ini adalah **kesepakatan bersama** tentang alamat, isi request, dan isi
jawaban setiap endpoint. Backend (repo `lapakpindah-backend`) dan aplikasi Flutter
(repo `mobile-lapakpindah`) sama-sama mengikuti dokumen ini, sehingga modul yang
dikerjakan di branch berbeda tetap cocok saat digabung ke `main`.

**Aturan mengubah kontrak:** endpoint milik modul Anda boleh Anda ubah
selama belum dipakai modul lain. Endpoint yang dipakai modul lain (ditandai
🔗) hanya boleh diubah setelah sepakat dengan pemakainya, dan perubahannya
dicatat di dokumen ini lewat Koordinator.

Status: ✅ sudah jadi di `main` · ⏳ belum dikerjakan

---

## 1. Konvensi

| Hal | Aturan |
|---|---|
| Alamat dasar | `http://localhost:3000/api/v1` (laptop) atau `https://lapakpindah.43-157-229-215.sslip.io/api/v1` (VPS) |
| Login | Header `Authorization: Bearer <token>` di semua endpoint kecuali `/auth/login` |
| Nama kolom JSON | camelCase, contoh `locationId`, `plannedCloseAt` (kolom MySQL tetap snake_case) |
| ID | Bilangan bulat |
| Uang | Bilangan bulat Rupiah, tanpa desimal |
| Waktu | Teks ISO 8601 UTC, contoh `"2026-11-17T09:00:00.000Z"`. Flutter: `DateTime.parse(...).toLocal()` dan kirim `dateTime.toUtc().toIso8601String()` |
| Daftar | Jawaban berupa array JSON `[...]` |
| Satu data | Jawaban berupa objek JSON `{...}` |
| Kepemilikan data | Server memakai pengguna dari token. **Jangan** kirim `userId` dari aplikasi |

### Kode status

| Kode | Arti | Contoh |
|---|---|---|
| 200 | Berhasil | GET, PUT |
| 201 | Berhasil menambah | POST tambah data |
| 204 | Berhasil menghapus, tanpa isi | DELETE |
| 400 | ID di URL atau JSON rusak | `/locations/abc` |
| 401 | Belum login / token kedaluwarsa | tanpa header Authorization |
| 404 | Data tidak ada atau milik pengguna lain | `/locations/999` |
| 409 | Bentrok dengan aturan data | buka sesi kedua, hapus lokasi yang punya sesi, catat penjualan tanpa sesi aktif |
| 422 | Isian tidak valid | nama kosong, jumlah negatif |
| 503 | Database mati | |

### Format error (semua endpoint)

```json
{
  "message": "Data lokasi tidak valid",
  "errors": { "name": "Nama lokasi wajib diisi" }
}
```

`errors` hanya ada untuk 422. Di Flutter keduanya tersedia di
`ApiException.message` dan `ApiException.fieldErrors`.

---

## 2. Auth — Koordinator

| Status | Method & alamat | Body | Jawaban |
|---|---|---|---|
| ✅ | `POST /auth/login` | `{ "identifier": "081234567890", "pin": "123456" }` | `{ "token": "...", "user": User }` |
| ✅ | `GET /auth/me` | – | `User` |

`identifier` boleh nomor WA (`+62 812-...`, `0812...`) atau email.

```json
// User
{ "id": 1, "displayName": "Bang Radit", "phone": "081234567890", "email": "radit@gmail.com" }
```

---

## 3. Modul 1 — Lokasi & Sesi Jualan (Anggota 1)

| Status | Method & alamat | Body | Jawaban |
|---|---|---|---|
| ✅ | `GET /locations` | – | `Location[]` urut nama |
| ✅ | `GET /locations/:id` | – | `Location` |
| ✅ | `POST /locations` | `{ name, note?, latitude?, longitude? }` | 201 `Location` |
| ✅ | `PUT /locations/:id` | sama dengan POST | `Location` |
| ✅ | `DELETE /locations/:id` | – | 204, atau 409 jika sudah punya sesi |
| ✅ 🔗 | `GET /sessions/active` | – | `ActiveSession` atau `null` |
| ⏳ | `GET /sessions?locationId=` | – | `Session[]` terbaru dulu |
| ⏳ | `POST /sessions` | `{ locationId, plannedCloseAt }` | 201 `Session`; 409 jika masih ada sesi aktif |
| ⏳ | `POST /sessions/:id/close` | – | `Session` |

```json
// Location
{ "id": 1, "name": "CFD Jam Gadang", "note": "Ramai Minggu pagi",
  "latitude": -0.3051, "longitude": 100.3692,
  "createdAt": "2026-11-17T03:00:00.000Z", "updatedAt": "2026-11-17T03:00:00.000Z" }

// ActiveSession  (dipakai Modul 2 dan 3)
{ "id": 2, "locationId": 1, "locationName": "CFD Jam Gadang",
  "openedAt": "2026-11-17T01:00:00.000Z", "plannedCloseAt": "2026-11-17T07:00:00.000Z" }

// Session
{ "id": 2, "locationId": 1, "locationName": "CFD Jam Gadang",
  "openedAt": "...", "plannedCloseAt": "...", "closedAt": null, "status": "aktif" }
```

**🔗 Titik sambung dengan Modul 2 (FR-08):** saat `POST /sessions`, Modul 1
memanggil `applyFixedCosts(connection, { sessionId, locationId, recordedAt })`
dari `src/modules/pengeluaran/fixed_costs/apply-fixed-costs.js` di
dalam transaksi yang sama. Isi fungsinya dikerjakan Anggota 2.

---

## 4. Modul 2 — Pengeluaran & Bukti Nota (Anggota 2)

Semua pengeluaran dicatat ke **sesi aktif**. Tanpa sesi aktif → 409.

| Status | Method & alamat | Body | Jawaban |
|---|---|---|---|
| ⏳ | `GET /expenses?sessionId=` | – | `Expense[]`; tanpa `sessionId` = sesi aktif |
| ⏳ | `POST /expenses` | `{ description, amount, category }` | 201 `Expense` |
| ⏳ | `PUT /expenses/:id` | sama dengan POST | `Expense` |
| ⏳ | `DELETE /expenses/:id` | – | 204 |
| ⏳ | `POST /expenses/:id/receipt` | multipart, field `photo` (JPG/PNG/WEBP, maks 5 MB) | `Expense` dengan `receiptPhotoUrl` |
| ⏳ | `DELETE /expenses/:id/receipt` | – | `Expense` dengan `receiptPhotoUrl: null` |
| ⏳ | `GET /fixed-costs?locationId=` | – | `FixedCost[]` |
| ⏳ | `POST /fixed-costs` | `{ locationId, description, amount }` | 201 `FixedCost` |
| ⏳ | `PUT /fixed-costs/:id` | `{ description, amount }` | `FixedCost` |
| ⏳ | `DELETE /fixed-costs/:id` | – | 204 |
| ⏳ | `GET /expense-limit` | – | `ExpenseLimit` sesi aktif |
| ⏳ | `PUT /expense-limit` | `{ limitAmount }` | `ExpenseLimit` |
| ⏳ | `POST /expense-limit/notified` | – | 204 (FR-10: tandai notifikasi sudah muncul) |

`category`: `bahanBaku`, `operasional`, `sewaRetribusi`, `kemasan`, `lainnya`
(sama dengan enum `ExpenseCategory` di Flutter).

```json
// Expense
{ "id": 2, "sessionId": 2, "description": "Retribusi CFD", "amount": 10000,
  "category": "sewaRetribusi", "receiptPhotoUrl": "/uploads/1731830000-123.jpg",
  "isFixedCost": true, "recordedAt": "..." }

// FixedCost
{ "id": 1, "locationId": 1, "description": "Retribusi CFD", "amount": 10000 }

// ExpenseLimit
{ "sessionId": 2, "limitAmount": 50000, "totalExpense": 10000,
  "remaining": 40000, "notified": false }
```

Foto dibuka dengan `<alamat server tanpa /api/v1>` + `receiptPhotoUrl`.

---

## 5. Modul 3 — Pencatatan Penjualan (Anggota 3)

| Status | Method & alamat | Body | Jawaban |
|---|---|---|---|
| ⏳ | `GET /products` | – | `Product[]` |
| ⏳ | `POST /products` | `{ name, sellingPrice }` | 201 `Product` |
| ⏳ | `PUT /products/:id` | `{ name, sellingPrice, isActive }` | `Product` |
| ⏳ | `DELETE /products/:id` | – | 204, atau 409 jika sudah pernah terjual |
| ⏳ | `GET /location-prices?locationId=` | – | `LocationPrice[]` |
| ⏳ | `PUT /location-prices` | `{ productId, locationId, price }` | `LocationPrice` (tambah atau ubah) |
| ⏳ | `DELETE /location-prices/:id` | – | 204 |
| ⏳ | `GET /sales?sessionId=` | – | `Sale[]`; tanpa `sessionId` = sesi aktif |
| ⏳ | `POST /sales` | `{ productId, quantity }` | 201 `Sale`; 409 tanpa sesi aktif |
| ⏳ | `DELETE /sales/:id` | – | 204 (koreksi salah catat) |
| ⏳ 🔗 | `GET /sales/break-even` | – | `BreakEven` sesi aktif |
| ⏳ | `POST /sales/break-even/notified` | – | 204 (FR-15) |

**Harga ditentukan server** (FR-13): `POST /sales` memakai harga khusus lokasi
sesi aktif jika ada, jika tidak memakai `sellingPrice`. Hasilnya disimpan di
`unitPrice` agar riwayat tidak berubah saat harga diubah.

```json
// Product
{ "id": 1, "name": "Es Teh", "sellingPrice": 5000, "isActive": true }

// LocationPrice
{ "id": 1, "productId": 1, "locationId": 1, "price": 6000 }

// Sale
{ "id": 2, "sessionId": 2, "productId": 2, "productName": "Kopi Susu",
  "quantity": 3, "unitPrice": 8000, "total": 24000, "recordedAt": "..." }

// BreakEven  (FR-14; totalExpense dibaca dari tabel expenses Modul 2)
{ "sessionId": 2, "totalSales": 24000, "totalExpense": 10000,
  "difference": 14000, "isBreakEven": true, "notified": false }
```

---

## 6. Modul 4 — Evaluasi Lokasi (Anggota 4)

Hanya **membaca** data Modul 1–3 (kecuali tabel `profit_targets` miliknya).
Lokasi tanpa sesi tetap muncul dengan angka 0, bukan error.

| Status | Method & alamat | Body | Jawaban |
|---|---|---|---|
| ⏳ | `GET /evaluation/ranking?from=&to=` | – | `RankingItem[]` laba tertinggi dulu |
| ⏳ | `GET /evaluation/trend?locationId=&period=daily\|weekly` | – | `TrendPoint[]` |
| ⏳ | `GET /evaluation/report?from=&to=` | – | `Report` (bahan PDF; PDF dibuat di aplikasi) |
| ⏳ | `GET /profit-targets` | – | `ProfitTarget[]` |
| ⏳ | `POST /profit-targets` | `{ locationId, amount }` | 201 `ProfitTarget`; 409 jika lokasi sudah punya target |
| ⏳ | `PUT /profit-targets/:id` | `{ amount }` | `ProfitTarget` |
| ⏳ | `DELETE /profit-targets/:id` | – | 204 |

`from`/`to` berformat tanggal `YYYY-MM-DD`, keduanya opsional.

```json
// RankingItem
{ "locationId": 1, "locationName": "CFD Jam Gadang", "sessionCount": 1,
  "totalSales": 24000, "totalExpense": 10000, "profit": 14000,
  "averageProfitPerSession": 14000 }

// TrendPoint
{ "periodStart": "2026-11-17", "profit": 14000 }

// ProfitTarget
{ "id": 1, "locationId": 1, "locationName": "CFD Jam Gadang", "amount": 100000,
  "lastSessionProfit": 14000, "achieved": false }

// Report
{ "from": "2026-11-01", "to": "2026-11-30", "ranking": [RankingItem],
  "totalSales": 74000, "totalExpense": 25000, "totalProfit": 49000 }
```

FR-20 (notifikasi mingguan) cukup di aplikasi, tidak butuh endpoint.

---

## Riwayat perubahan kontrak

| Tanggal | Perubahan | Oleh |
|---|---|---|
| 2026-11-17 | Versi pertama | Koordinator |
