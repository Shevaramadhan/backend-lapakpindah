import { findActiveSession } from '../../../shared/active-session.js';

// Dibuat Koordinator lebih dulu karena Modul 2 dan 3 membutuhkannya.
// Endpoint sesi lainnya (riwayat, buka, tutup) dikerjakan Anggota 1.

// GET /sessions/active → sesi aktif, atau null jika belum ada.
export async function active(req, res) {
  res.json(await findActiveSession(req.userId));
}
