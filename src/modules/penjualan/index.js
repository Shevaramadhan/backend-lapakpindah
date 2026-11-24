import { Router } from 'express';

// Pemilik: Anggota 3 — Modul 3 Pencatatan Penjualan (FR-11 s.d. FR-15).
// Kontrak lengkap: docs/api/kontrak-api.md bagian Modul 3.
// File ini hanya diubah oleh pemilik modul.
export const penjualanRoutes = Router();

// TODO — buat subfolder dengan pola modules/sesi_lokasi/locations/:
//   ./products/          FR-11 CRUD produk
//   ./location_prices/   FR-13 harga khusus per lokasi
//   ./sales/             FR-12 catat penjualan sesi aktif
//                        FR-14 GET /sales/break-even (penjualan vs pengeluaran sesi aktif)
//
// Sesi aktif: import { requireActiveSession } from '../../shared/active-session.js';
