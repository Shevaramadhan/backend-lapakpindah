import { HttpError } from '../../../shared/http-error.js';
import { parseId } from '../../../shared/validate.js';
import * as repository from './location.repository.js';
import { validateLocation } from './location.validator.js';

// Express 5 meneruskan error dari fungsi async ke errorHandler secara otomatis,
// jadi controller tidak perlu try-catch.

export async function list(req, res) {
  res.json(await repository.findAll(req.userId));
}

export async function show(req, res) {
  const location = await repository.findById(req.userId, parseId(req.params.id));
  if (!location) throw new HttpError(404, 'Lokasi tidak ditemukan');
  res.json(location);
}

export async function create(req, res) {
  const location = await repository.create(req.userId, validateLocation(req.body));
  res.status(201).json(location);
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  const location = await repository.update(req.userId, id, validateLocation(req.body));
  if (!location) throw new HttpError(404, 'Lokasi tidak ditemukan');
  res.json(location);
}

export async function remove(req, res) {
  const deleted = await repository.remove(req.userId, parseId(req.params.id));
  if (!deleted) throw new HttpError(404, 'Lokasi tidak ditemukan');
  res.status(204).end();
}
