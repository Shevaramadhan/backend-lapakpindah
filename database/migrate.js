// Membuat database lalu menjalankan semua file di database/schema/ berurutan.
//
//   npm run db:migrate   → membuat tabel yang belum ada (data lama tetap)
//   npm run db:fresh     → HAPUS database, buat ulang, lalu isi data demo.
//                          Pakai ini setelah ada perubahan kolom dari teman.
import { readdir, readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { config } from '../src/config/env.js';

const fresh = process.argv.includes('--fresh');
const schemaDir = new URL('./schema/', import.meta.url);
const files = (await readdir(schemaDir)).filter((f) => f.endsWith('.sql')).sort();

const connection = await mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  multipleStatements: true,
});

try {
  if (fresh) {
    try {
      await connection.query(`DROP DATABASE IF EXISTS \`${config.db.name}\``);
      console.log(`Database "${config.db.name}" dihapus.`);
    } catch (err) {
      if (err.code !== 'ER_DBACCESS_DENIED_ERROR') throw err;
      // User non-root (misalnya di Docker/VPS): kosongkan semua tabel di dalam database.
      await connection.query(`USE \`${config.db.name}\``);
      const [tables] = await connection.query('SHOW TABLES');
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      for (const row of tables) {
        const tableName = Object.values(row)[0];
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      }
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log(`Semua tabel di "${config.db.name}" dihapus.`);
    }
  }

  try {
    await connection.query(`USE \`${config.db.name}\``);
  } catch (err) {
    if (err.code !== 'ER_BAD_DB_ERROR') throw err;
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.query(`USE \`${config.db.name}\``);
  }

  await connection.query("SET time_zone = '+00:00'");

  for (const file of files) {
    await connection.query(await readFile(new URL(file, schemaDir), 'utf8'));
    console.log(`  ✓ ${file}`);
  }
  console.log(`Migrasi selesai: database "${config.db.name}" siap dipakai.`);
} finally {
  await connection.end();
}
