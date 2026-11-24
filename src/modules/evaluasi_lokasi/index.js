import { Router } from 'express';

// Pemilik: Anggota 4 — Modul 4 Evaluasi Lokasi (FR-16 s.d. FR-20).
// Kontrak lengkap: docs/api/kontrak-api.md bagian Modul 4.
// File ini hanya diubah oleh pemilik modul.
export const evaluasiLokasiRoutes = Router();

// TODO — buat subfolder dengan pola modules/sesi_lokasi/locations/:
//   ./ranking/   FR-16 GET /evaluation/ranking   laba per lokasi (JOIN sesi, sales, expenses)
//   ./trend/     FR-17 GET /evaluation/trend     laba lokasi per hari/minggu
//   ./targets/   FR-18 CRUD target laba per lokasi
//   ./report/    FR-19 GET /evaluation/report    data untuk PDF (PDF dibuat di aplikasi)
//
// Modul ini hanya MEMBACA tabel modul lain. Hati-hati pembagian dengan nol
// untuk lokasi yang belum punya sesi: laba harus 0, bukan error/NULL.
