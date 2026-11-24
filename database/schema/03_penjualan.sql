-- Pemilik: Anggota 3 — Modul 3 Pencatatan Penjualan (FR-11 s.d. FR-15)
-- Bergantung pada: locations, sales_sessions (Modul 1)
-- Dibaca Modul 4 (laba per sesi/lokasi).

CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  name          VARCHAR(100) NOT NULL,
  selling_price INT NOT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_products_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS location_prices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  location_id INT NOT NULL,
  price       INT NOT NULL,
  CONSTRAINT fk_prices_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_prices_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE,
  UNIQUE KEY uq_product_location (product_id, location_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sales (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  -- Harga saat transaksi disalin agar riwayat tidak berubah saat harga diubah.
  unit_price  INT NOT NULL,
  recorded_at DATETIME NOT NULL,
  CONSTRAINT fk_sales_session FOREIGN KEY (session_id) REFERENCES sales_sessions (id) ON DELETE CASCADE,
  -- RESTRICT: produk yang sudah terjual tidak boleh dihapus (FR-11).
  CONSTRAINT fk_sales_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
) ENGINE=InnoDB;
