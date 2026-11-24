import { HttpError } from './http-error.js';

// Pembantu validasi yang dipakai semua modul. Pola pemakaian di validator:
//
//   const errors = {};
//   const name = readText(body, 'name', errors, { label: 'Nama lokasi', max: 100 });
//   const amount = readRupiah(body, 'amount', errors, { label: 'Jumlah' });
//   throwIfInvalid(errors, 'Data pengeluaran tidak valid');
//   return { name, amount };
//
// Setiap fungsi mencatat pesan ke `errors[field]` jika salah, lalu
// throwIfInvalid melempar 422 sekaligus untuk semua kolom yang salah.

export function readText(body, field, errors, { label, max = 255, required = true }) {
  const value = typeof body?.[field] === 'string' ? body[field].trim() : '';
  if (value === '') {
    if (required) errors[field] = `${label} wajib diisi`;
    return null;
  }
  if (value.length > max) errors[field] = `${label} maksimal ${max} karakter`;
  return value;
}

// Uang dalam Rupiah: bilangan bulat, tidak negatif.
export function readRupiah(body, field, errors, { label, required = true, min = 0 }) {
  const value = body?.[field];
  if (value === undefined || value === null) {
    if (required) errors[field] = `${label} wajib diisi`;
    return null;
  }
  if (!Number.isInteger(value) || value < min) {
    errors[field] = `${label} harus bilangan bulat minimal ${min}`;
  }
  return value;
}

// Bilangan bulat positif, misalnya jumlah terjual atau ID yang dikirim di body.
export function readPositiveInt(body, field, errors, { label, required = true }) {
  const value = body?.[field];
  if (value === undefined || value === null) {
    if (required) errors[field] = `${label} wajib diisi`;
    return null;
  }
  if (!Number.isInteger(value) || value <= 0) {
    errors[field] = `${label} harus bilangan bulat lebih dari 0`;
  }
  return value;
}

// Waktu ISO 8601, contoh "2026-11-17T09:00:00.000Z". Mengembalikan Date.
export function readDateTime(body, field, errors, { label, required = true }) {
  const value = body?.[field];
  if (value === undefined || value === null || value === '') {
    if (required) errors[field] = `${label} wajib diisi`;
    return null;
  }
  const date = typeof value === 'string' ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    errors[field] = `${label} harus berformat waktu ISO 8601`;
    return null;
  }
  return date;
}

export function throwIfInvalid(errors, message) {
  if (Object.keys(errors).length > 0) throw new HttpError(422, message, errors);
}

// ID dari URL (/locations/:id).
export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'ID harus bilangan bulat positif');
  }
  return id;
}
