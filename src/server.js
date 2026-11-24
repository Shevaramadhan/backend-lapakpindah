import { app } from './app.js';
import { db } from './config/db.js';
import { config } from './config/env.js';

// 0.0.0.0 agar HP di jaringan Wi-Fi yang sama dan reverse proxy Docker bisa mengakses server.
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`LapakPindah API berjalan di http://localhost:${config.port}`);
});

async function shutdown(signal) {
  console.log(`Menerima ${signal}, menutup server...`);
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
