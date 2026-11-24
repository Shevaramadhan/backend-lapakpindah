import { readText, throwIfInvalid } from '../../shared/validate.js';

// Sama dengan AuthRepository.normalizeIdentifier di Flutter:
// email → huruf kecil; nomor WA → tanpa spasi/strip, "+62"/"62" menjadi "0".
export function normalizeIdentifier(input) {
  const value = input.trim();
  if (value.includes('@')) return value.toLowerCase();
  let digits = value.replace(/[\s-]/g, '');
  if (digits.startsWith('+62')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('62')) digits = `0${digits.slice(2)}`;
  return digits;
}

export function validateLogin(body) {
  const errors = {};
  const identifier = readText(body, 'identifier', errors, { label: 'Nomor WhatsApp/email', max: 150 });
  const pin = readText(body, 'pin', errors, { label: 'PIN', max: 20 });
  throwIfInvalid(errors, 'Data login tidak valid');
  return { identifier: normalizeIdentifier(identifier), pin };
}
