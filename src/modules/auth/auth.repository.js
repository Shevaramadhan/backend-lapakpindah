import { db } from '../../config/db.js';

const columns = 'id, display_name AS displayName, phone, email';

// Mencari pengguna dari nomor WA atau email yang sudah dinormalisasi.
export async function findByIdentifier(identifier) {
  const [rows] = await db.query(
    `SELECT ${columns}, pin_hash AS pinHash FROM users WHERE phone = ? OR email = ?`,
    [identifier, identifier],
  );
  return rows[0] ?? null;
}

export async function findById(id) {
  const [rows] = await db.query(`SELECT ${columns} FROM users WHERE id = ?`, [id]);
  return rows[0] ?? null;
}
