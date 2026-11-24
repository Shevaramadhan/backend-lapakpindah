-- Data demo bersama. Dengan data ini setiap anggota bisa mengerjakan
-- modulnya tanpa menunggu modul lain selesai: sudah ada lokasi, satu sesi
-- selesai, satu sesi aktif, produk, penjualan, dan pengeluaran.
--
-- Pemilik: Koordinator. Usulkan tambahan data lewat koordinator agar file
-- ini tidak bentrok.

-- Akun demo, sama dengan akun demo di aplikasi: 081234567890 / PIN 123456
INSERT IGNORE INTO users (id, display_name, phone, email, pin_hash) VALUES
  (1, 'Bang Radit', '081234567890', 'radit@gmail.com',
   '$2b$10$rdRm3lPu7R4wBSCNZ8JtA.aNYHf6kZr5lY72FbIn.W.eFdbCN3X9G');

-- Modul 1
INSERT IGNORE INTO locations (id, user_id, name, note, latitude, longitude) VALUES
  (1, 1, 'CFD Jam Gadang', 'Ramai Minggu pagi', -0.3051, 100.3692),
  (2, 1, 'Area Perkantoran', NULL, NULL, NULL);

INSERT IGNORE INTO sales_sessions (id, user_id, location_id, opened_at, planned_close_at, closed_at, status) VALUES
  (1, 1, 2, UTC_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 6 HOUR,
            UTC_TIMESTAMP() - INTERVAL 1 DAY, UTC_TIMESTAMP() - INTERVAL 1 DAY, 'selesai'),
  (2, 1, 1, UTC_TIMESTAMP() - INTERVAL 2 HOUR,
            UTC_TIMESTAMP() + INTERVAL 4 HOUR, NULL, 'aktif');

-- Modul 2
INSERT IGNORE INTO location_fixed_costs (id, location_id, description, amount) VALUES
  (1, 1, 'Retribusi CFD', 10000);

INSERT IGNORE INTO expenses (id, session_id, description, amount, category, is_fixed_cost, recorded_at) VALUES
  (1, 1, 'Es batu', 15000, 'bahanBaku', 0, UTC_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 5 HOUR),
  (2, 2, 'Retribusi CFD', 10000, 'sewaRetribusi', 1, UTC_TIMESTAMP() - INTERVAL 2 HOUR);

INSERT IGNORE INTO expense_limits (session_id, limit_amount) VALUES
  (2, 50000);

-- Modul 3
INSERT IGNORE INTO products (id, user_id, name, selling_price) VALUES
  (1, 1, 'Es Teh', 5000),
  (2, 1, 'Kopi Susu', 8000);

INSERT IGNORE INTO location_prices (id, product_id, location_id, price) VALUES
  (1, 1, 1, 6000);

INSERT IGNORE INTO sales (id, session_id, product_id, quantity, unit_price, recorded_at) VALUES
  (1, 1, 1, 10, 5000, UTC_TIMESTAMP() - INTERVAL 1 DAY - INTERVAL 3 HOUR),
  (2, 2, 2, 3, 8000, UTC_TIMESTAMP() - INTERVAL 1 HOUR);

-- Modul 4
INSERT IGNORE INTO profit_targets (id, location_id, amount) VALUES
  (1, 1, 100000);
