import { Router } from 'express';

// Pemilik: Anggota 2 — Modul 2 Pengeluaran & Bukti Nota (FR-06 s.d. FR-10).
// Kontrak lengkap: docs/api/kontrak-api.md bagian Modul 2.
// File ini hanya diubah oleh pemilik modul.
export const pengeluaranRoutes = Router();

// TODO — buat subfolder dengan pola modules/sesi_lokasi/locations/:
//   ./expenses/      FR-06 CRUD pengeluaran sesi aktif
//                    FR-07 POST /expenses/:id/receipt  (pakai uploadImage dari shared/upload.js)
//   ./fixed_costs/   FR-08 CRUD biaya tetap per lokasi
//   ./limits/        FR-09 batas pengeluaran sesi aktif
//
// Sesi aktif: import { requireActiveSession } from '../../shared/active-session.js';
