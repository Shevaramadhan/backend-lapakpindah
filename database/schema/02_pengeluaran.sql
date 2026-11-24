-- Pemilik: Anggota 2 — Modul 2 Pengeluaran & Bukti Nota (FR-06 s.d. FR-10)
-- Bergantung pada: locations, sales_sessions (Modul 1)
-- Dibaca Modul 3 (total pengeluaran untuk balik modal) dan Modul 4 (laba).

CREATE TABLE IF NOT EXISTS location_fixed_costs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT NOT NULL,
  description VARCHAR(150) NOT NULL,
  amount      INT NOT NULL,
  CONSTRAINT fk_fixed_costs_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expenses (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  session_id         INT NOT NULL,
  description        VARCHAR(150) NOT NULL,
  amount             INT NOT NULL,
  -- Sama dengan enum ExpenseCategory di Flutter:
  -- bahanBaku, operasional, sewaRetribusi, kemasan, lainnya
  category           VARCHAR(30) NOT NULL,
  -- Alamat file foto di server, contoh: /uploads/nota-12.jpg
  receipt_photo_url  VARCHAR(255) NULL,
  is_fixed_cost      TINYINT(1) NOT NULL DEFAULT 0,
  recorded_at        DATETIME NOT NULL,
  CONSTRAINT fk_expenses_session FOREIGN KEY (session_id) REFERENCES sales_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expense_limits (
  session_id   INT PRIMARY KEY,
  limit_amount INT NOT NULL,
  CONSTRAINT fk_limits_session FOREIGN KEY (session_id) REFERENCES sales_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB;
