import { readText, throwIfInvalid } from '../../../shared/validate.js';

// Memeriksa body POST/PUT /locations dan mengembalikan data yang sudah rapi.
export function validateLocation(body) {
  const errors = {};
  const name = readText(body, 'name', errors, { label: 'Nama lokasi', max: 100 });
  const note = readText(body, 'note', errors, { label: 'Catatan', required: false });
  const latitude = body?.latitude ?? null;
  const longitude = body?.longitude ?? null;

  // Koordinat boleh kosong (belum ditandai GPS), tapi harus berpasangan.
  if ((latitude === null) !== (longitude === null)) {
    errors.coordinate = 'Latitude dan longitude harus diisi bersamaan';
  } else if (latitude !== null) {
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      errors.latitude = 'Latitude harus angka antara -90 dan 90';
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      errors.longitude = 'Longitude harus angka antara -180 dan 180';
    }
  }

  throwIfInvalid(errors, 'Data lokasi tidak valid');
  return { name, note, latitude, longitude };
}
