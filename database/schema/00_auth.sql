-- Pemilik: Koordinator (Auth & Beranda)
--
-- Aturan bersama untuk semua file schema:
--   - ID bertipe INT AUTO_INCREMENT.
--   - Uang bertipe INT (Rupiah, tanpa sen).
--   - Waktu bertipe DATETIME dalam UTC.
--   - Relasi ke tabel modul lain WAJIB memakai FOREIGN KEY (NFR-05).
--   - File dijalankan berurutan sesuai nomor, jadi tabel yang dirujuk
--     harus ada di file dengan nomor lebih kecil.

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  display_name  VARCHAR(100) NOT NULL,
  phone         VARCHAR(20)  NOT NULL UNIQUE,
  email         VARCHAR(150) NULL UNIQUE,
  pin_hash      VARCHAR(255) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
