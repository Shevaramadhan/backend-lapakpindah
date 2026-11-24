// TITIK SAMBUNG Modul 1 → Modul 2 (FR-08).
//
// Dipanggil Anggota 1 di endpoint POST /sessions, di dalam transaksi yang
// sama dengan pembuatan sesi:
//
//   import { applyFixedCosts } from '../../pengeluaran/fixed_costs/apply-fixed-costs.js';
//   await applyFixedCosts(connection, { sessionId, locationId, recordedAt });
//
// Isi fungsi dikerjakan Anggota 2. Nama dan parameter JANGAN diubah tanpa
// sepakat dengan Anggota 1, karena Modul 1 memanggilnya.
//
// `connection` adalah koneksi transaksi (db.getConnection()), bukan pool,
// supaya pembuatan sesi dan biaya tetap berhasil atau gagal bersama.

export async function applyFixedCosts(connection, { sessionId, locationId, recordedAt }) {
  // TODO Anggota 2: salin semua location_fixed_costs milik locationId ke
  // tabel expenses dengan is_fixed_cost = 1 dan session_id = sessionId.
  // Contoh: INSERT INTO expenses (...) SELECT ... FROM location_fixed_costs WHERE location_id = ?
}
