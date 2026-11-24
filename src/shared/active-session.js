import { db } from '../config/db.js';
import { HttpError } from './http-error.js';

// Pembaca sesi aktif untuk modul yang mencatat data ke sesi (Modul 2 dan 3).
// Tabel sales_sessions milik Modul 1; file ini hanya MEMBACA, jadi aman
// dipakai bersama tanpa menunggu endpoint sesi Modul 1 selesai.

export async function findActiveSession(userId) {
  const [rows] = await db.query(
    `SELECT s.id, s.location_id AS locationId, l.name AS locationName,
            s.opened_at AS openedAt, s.planned_close_at AS plannedCloseAt
       FROM sales_sessions s
       JOIN locations l ON l.id = s.location_id
      WHERE s.user_id = ? AND s.status = 'aktif'`,
    [userId],
  );
  return rows[0] ?? null;
}

// Sama seperti findActiveSession, tetapi melempar 409 jika belum ada sesi aktif.
// Contoh di controller Modul 2: const session = await requireActiveSession(req.userId);
export async function requireActiveSession(userId) {
  const session = await findActiveSession(userId);
  if (!session) throw new HttpError(409, 'Belum ada sesi jualan yang aktif');
  return session;
}
