import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  parseId,
  readDateTime,
  readPositiveInt,
  readRupiah,
  readText,
  throwIfInvalid,
} from '../../src/shared/validate.js';

test('readRupiah menolak pecahan dan angka negatif', () => {
  const errors = {};
  assert.equal(readRupiah({ a: 5000 }, 'a', errors, { label: 'Jumlah' }), 5000);
  readRupiah({ b: 10.5 }, 'b', errors, { label: 'Jumlah' });
  readRupiah({ c: -1 }, 'c', errors, { label: 'Jumlah' });
  readRupiah({}, 'd', errors, { label: 'Jumlah' });
  assert.deepEqual(Object.keys(errors), ['b', 'c', 'd']);
});

test('readText opsional mengembalikan null tanpa error', () => {
  const errors = {};
  assert.equal(readText({ note: '' }, 'note', errors, { label: 'Catatan', required: false }), null);
  assert.deepEqual(errors, {});
});

test('readPositiveInt dan readDateTime', () => {
  const errors = {};
  assert.equal(readPositiveInt({ q: 3 }, 'q', errors, { label: 'Jumlah' }), 3);
  readPositiveInt({ q: 0 }, 'zero', errors, { label: 'Jumlah' });
  const date = readDateTime({ t: '2026-11-17T09:00:00.000Z' }, 't', errors, { label: 'Waktu' });
  assert.equal(date.toISOString(), '2026-11-17T09:00:00.000Z');
  readDateTime({ t: 'besok' }, 'bad', errors, { label: 'Waktu' });
  assert.deepEqual(Object.keys(errors), ['zero', 'bad']);
});

test('throwIfInvalid melempar 422 dengan semua pesan kolom', () => {
  assert.doesNotThrow(() => throwIfInvalid({}, 'x'));
  assert.throws(() => throwIfInvalid({ a: 'salah' }, 'Data tidak valid'), (err) => {
    assert.equal(err.status, 422);
    assert.deepEqual(err.errors, { a: 'salah' });
    return true;
  });
});

test('parseId hanya menerima bilangan bulat positif', () => {
  assert.equal(parseId('12'), 12);
  assert.throws(() => parseId('abc'), (err) => err.status === 400);
  assert.throws(() => parseId('0'), (err) => err.status === 400);
});
