import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateLocation } from '../../src/modules/sesi_lokasi/locations/location.validator.js';

test('lokasi valid dirapikan: nama di-trim, catatan kosong jadi null', () => {
  assert.deepEqual(validateLocation({ name: '  Alun-alun ', note: '  ' }), {
    name: 'Alun-alun',
    note: null,
    latitude: null,
    longitude: null,
  });
});

test('nama kosong ditolak dengan status 422', () => {
  assert.throws(() => validateLocation({ name: '   ' }), (err) => {
    assert.equal(err.status, 422);
    assert.ok(err.errors.name);
    return true;
  });
});

test('koordinat harus berpasangan dan dalam rentang', () => {
  assert.throws(() => validateLocation({ name: 'Pantai', latitude: -0.9 }), /tidak valid/);
  assert.throws(() => validateLocation({ name: 'Pantai', latitude: 91, longitude: 100 }), /tidak valid/);
  assert.deepEqual(
    validateLocation({ name: 'Pantai', latitude: -0.95, longitude: 100.35 }),
    { name: 'Pantai', note: null, latitude: -0.95, longitude: 100.35 },
  );
});
