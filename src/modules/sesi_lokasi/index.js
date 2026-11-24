import { Router } from 'express';
import * as locations from './locations/location.controller.js';
import * as sessions from './sessions/session.controller.js';

// Pemilik: Anggota 1 — Modul 1 Lokasi & Sesi Jualan (FR-01 s.d. FR-05).
// Kontrak lengkap: docs/api/kontrak-api.md bagian Modul 1.
// File ini hanya diubah oleh pemilik modul.
export const sesiLokasiRoutes = Router();

// FR-01 CRUD lokasi (SUDAH JADI — juga contoh pola untuk modul lain)
// FR-02 koordinat GPS ikut disimpan lewat body latitude/longitude.
sesiLokasiRoutes.get('/locations', locations.list);
sesiLokasiRoutes.get('/locations/:id', locations.show);
sesiLokasiRoutes.post('/locations', locations.create);
sesiLokasiRoutes.put('/locations/:id', locations.update);
sesiLokasiRoutes.delete('/locations/:id', locations.remove);

// FR-03 sesi jualan. /sessions/active SUDAH JADI karena dibutuhkan Modul 2 dan 3.
// Daftarkan sebelum '/sessions/:id' agar "active" tidak dianggap ID.
sesiLokasiRoutes.get('/sessions/active', sessions.active);

// TODO Anggota 1 — lanjutkan di ./sessions/ dengan pola yang sama:
//   GET  /sessions              riwayat sesi (filter ?locationId=)
//   POST /sessions              buka sesi { locationId, plannedCloseAt }
//                               + catat biaya tetap lokasi otomatis (FR-08, koordinasi Modul 2)
//   POST /sessions/:id/close    tutup sesi
