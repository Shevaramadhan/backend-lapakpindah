import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeIdentifier, validateLogin } from '../../src/modules/auth/auth.validator.js';

test('normalisasi sama dengan aplikasi Flutter', () => {
  assert.equal(normalizeIdentifier('+62 812-3456-7890'), '081234567890');
  assert.equal(normalizeIdentifier('6281234567890'), '081234567890');
  assert.equal(normalizeIdentifier(' Radit@Gmail.com '), 'radit@gmail.com');
});

test('login tanpa PIN ditolak 422', () => {
  assert.throws(() => validateLogin({ identifier: '0812' }), (err) => {
    assert.equal(err.status, 422);
    assert.ok(err.errors.pin);
    return true;
  });
});
