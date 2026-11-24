// Mengisi data demo dari database/seeds/*.sql. Aman dijalankan berulang
// karena data demo memakai ID tetap dan INSERT IGNORE.
import { readdir, readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { config } from '../src/config/env.js';

const seedDir = new URL('./seeds/', import.meta.url);
const files = (await readdir(seedDir)).filter((f) => f.endsWith('.sql')).sort();

const connection = await mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  multipleStatements: true,
});

try {
  await connection.query("SET time_zone = '+00:00'");
  for (const file of files) {
    await connection.query(await readFile(new URL(file, seedDir), 'utf8'));
    console.log(`  ✓ ${file}`);
  }
  console.log('Data demo terisi. Login: 081234567890 / PIN 123456');
} finally {
  await connection.end();
}
