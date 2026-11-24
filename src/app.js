import cors from 'cors';
import express from 'express';
import { config } from './config/env.js';
import { db } from './config/db.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authRoutes } from './modules/auth/index.js';
import { evaluasiLokasiRoutes } from './modules/evaluasi_lokasi/index.js';
import { pengeluaranRoutes } from './modules/pengeluaran/index.js';
import { penjualanRoutes } from './modules/penjualan/index.js';
import { sesiLokasiRoutes } from './modules/sesi_lokasi/index.js';

// File bersama milik Koordinator. Semua modul SUDAH didaftarkan di bawah,
// jadi anggota cukup mengisi src/modules/<modul>/index.js masing-masing
// tanpa perlu mengubah file ini.

export const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
// Foto nota (Modul 2) bisa dibuka di /uploads/<nama-file>.
app.use('/uploads', express.static(config.uploadDir));

// Cek apakah server dan database hidup. Berguna setelah deploy.
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'ok', database: 'disconnected' });
  }
});

const api = express.Router();
api.use(authRoutes); // /auth/login tanpa token, /auth/me dengan token

api.use(requireAuth); // semua endpoint di bawah ini wajib login
api.use(sesiLokasiRoutes); // Modul 1: /locations, /sessions
api.use(pengeluaranRoutes); // Modul 2: /expenses, /fixed-costs, /expense-limit
api.use(penjualanRoutes); // Modul 3: /products, /location-prices, /sales
api.use(evaluasiLokasiRoutes); // Modul 4: /evaluation, /profit-targets

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);
