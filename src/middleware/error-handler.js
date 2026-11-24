import { HttpError } from '../shared/http-error.js';

export function notFound(req, res) {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });
}

// Semua error berakhir di sini, sehingga format respons error selalu sama:
// { message, errors? }  — errors berisi pesan per kolom untuk status 422.
export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  // Body JSON yang rusak dari express.json().
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Body request bukan JSON yang valid' });
  }

  // Upload terlalu besar atau field file salah (multer).
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran foto maksimal 5 MB' : 'Upload foto gagal';
    return res.status(422).json({ message });
  }

  // Data masih dipakai tabel lain (foreign key RESTRICT).
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'Data tidak bisa dihapus karena masih dipakai data lain' });
  }

  // Data kembar, misalnya sesi aktif kedua atau harga khusus ganda.
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Data yang sama sudah ada' });
  }

  // ID rujukan tidak ada, misalnya location_id yang salah.
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(422).json({ message: 'Data yang dirujuk tidak ditemukan' });
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_BAD_DB_ERROR') {
    console.error(err);
    return res.status(503).json({ message: 'Database tidak dapat dihubungi' });
  }

  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan di server' });
}
