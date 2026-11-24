import { db } from '../../../config/db.js';

// Semua query SQL untuk tabel locations. Setiap query dibatasi user_id
// supaya pengguna hanya bisa melihat dan mengubah lokasinya sendiri.

const columns = 'id, name, note, latitude, longitude, created_at AS createdAt, updated_at AS updatedAt';

export async function findAll(userId) {
  const [rows] = await db.query(
    `SELECT ${columns} FROM locations WHERE user_id = ? ORDER BY name`,
    [userId],
  );
  return rows;
}

export async function findById(userId, id) {
  const [rows] = await db.query(
    `SELECT ${columns} FROM locations WHERE user_id = ? AND id = ?`,
    [userId, id],
  );
  return rows[0] ?? null;
}

export async function create(userId, { name, note, latitude, longitude }) {
  const [result] = await db.query(
    'INSERT INTO locations (user_id, name, note, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
    [userId, name, note, latitude, longitude],
  );
  return findById(userId, result.insertId);
}

export async function update(userId, id, { name, note, latitude, longitude }) {
  const [result] = await db.query(
    'UPDATE locations SET name = ?, note = ?, latitude = ?, longitude = ? WHERE user_id = ? AND id = ?',
    [name, note, latitude, longitude, userId, id],
  );
  return result.affectedRows === 0 ? null : findById(userId, id);
}

// Mengembalikan false jika lokasi tidak ditemukan. Lokasi yang sudah punya
// sesi ditolak MySQL (ER_ROW_IS_REFERENCED_2) dan dijawab 409 oleh errorHandler.
export async function remove(userId, id) {
  const [result] = await db.query('DELETE FROM locations WHERE user_id = ? AND id = ?', [userId, id]);
  return result.affectedRows > 0;
}
