import mysql from 'mysql2/promise';
import { config } from './env.js';

// Satu pool koneksi dipakai bersama oleh semua repository.
export const db = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  connectionLimit: 10,
  // DECIMAL (latitude/longitude) dikembalikan sebagai number, bukan string.
  decimalNumbers: true,
  // Semua waktu disimpan dan dibaca dalam UTC. Aplikasi mengirim waktu
  // ISO 8601 dan mengubahnya ke jam lokal sendiri saat ditampilkan.
  timezone: 'Z',
});

// DEFAULT CURRENT_TIMESTAMP di MySQL juga ikut UTC.
db.pool.on('connection', (connection) => {
  connection.query("SET time_zone = '+00:00'");
});
