import { mkdirSync } from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { config } from '../config/env.js';
import { HttpError } from './http-error.js';

// Penerima upload foto (dipakai Modul 2 untuk foto nota, FR-07).
// Pemakaian di route:
//   router.post('/expenses/:id/receipt', uploadImage.single('photo'), controller.uploadReceipt);
// Lalu di controller: `/uploads/${req.file.filename}` disimpan ke receipt_photo_url.

mkdirSync(config.uploadDir, { recursive: true });

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: config.uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowed.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(422, 'File harus gambar JPG, PNG, atau WEBP'));
  },
});
