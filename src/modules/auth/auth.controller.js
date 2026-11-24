import bcrypt from 'bcryptjs';
import { signToken } from '../../middleware/auth.js';
import { HttpError } from '../../shared/http-error.js';
import * as repository from './auth.repository.js';
import { validateLogin } from './auth.validator.js';

export async function login(req, res) {
  const { identifier, pin } = validateLogin(req.body);
  const user = await repository.findByIdentifier(identifier);
  // Pesan yang sama untuk akun tidak ada dan PIN salah, agar tidak membocorkan
  // nomor mana yang terdaftar.
  if (!user || !(await bcrypt.compare(pin, user.pinHash))) {
    throw new HttpError(401, 'Nomor/email atau PIN salah.');
  }
  const { pinHash: _, ...publicUser } = user;
  res.json({ token: signToken(user.id), user: publicUser });
}

export async function me(req, res) {
  const user = await repository.findById(req.userId);
  if (!user) throw new HttpError(401, 'Akun tidak ditemukan, silakan masuk lagi');
  res.json(user);
}
