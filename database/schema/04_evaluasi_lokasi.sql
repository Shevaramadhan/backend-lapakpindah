-- Pemilik: Anggota 4 — Modul 4 Evaluasi Lokasi (FR-16 s.d. FR-20)
-- Bergantung pada: locations, sales_sessions (Modul 1), expenses (Modul 2),
-- sales (Modul 3). Modul ini hanya MEMBACA tabel modul lain lewat JOIN,
-- tidak pernah mengubahnya.

CREATE TABLE IF NOT EXISTS profit_targets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT NOT NULL UNIQUE,
  amount      INT NOT NULL,
  CONSTRAINT fk_targets_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
) ENGINE=InnoDB;
