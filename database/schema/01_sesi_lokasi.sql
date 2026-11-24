-- Pemilik: Anggota 1 — Modul 1 Lokasi & Sesi Jualan (FR-01 s.d. FR-05)
-- Dipakai modul lain: locations (Modul 2, 3, 4), sales_sessions (Modul 2, 3, 4)

CREATE TABLE IF NOT EXISTS locations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       VARCHAR(100) NOT NULL,
  note       VARCHAR(255) NULL,
  latitude   DECIMAL(10, 7) NULL,
  longitude  DECIMAL(10, 7) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_locations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sales_sessions (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL,
  location_id         INT NOT NULL,
  opened_at           DATETIME NOT NULL,
  planned_close_at    DATETIME NOT NULL,
  closed_at           DATETIME NULL,
  status              ENUM('aktif', 'selesai') NOT NULL DEFAULT 'aktif',
  -- Penanda notifikasi "sekali per sesi" (FR-10 milik Modul 2, FR-15 milik
  -- Modul 3). Disimpan di sini agar tidak muncul ulang setelah aplikasi dibuka lagi.
  limit_notified      TINYINT(1) NOT NULL DEFAULT 0,
  break_even_notified TINYINT(1) NOT NULL DEFAULT 0,
  -- Bernilai user_id hanya saat sesi aktif, NULL saat selesai. UNIQUE di kolom
  -- ini membuat satu pengguna hanya bisa punya satu sesi aktif (NFR-05).
  active_user_id      INT AS (IF(status = 'aktif', user_id, NULL)) STORED,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  -- RESTRICT: lokasi yang sudah punya sesi tidak boleh dihapus (FR-01).
  CONSTRAINT fk_sessions_location FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE RESTRICT,
  UNIQUE KEY uq_one_active_session (active_user_id)
) ENGINE=InnoDB;
