import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { HttpError } from '../shared/http-error.js';

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

// Wajib login. Aplikasi mengirim header "Authorization: Bearer <token>".
// Setelah lolos, req.userId berisi ID pengguna yang login. Selalu pakai
// req.userId untuk membatasi data, JANGAN user_id yang dikirim aplikasi.
export function requireAuth(req, _res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Silakan masuk terlebih dahulu'));
  }
  try {
    req.userId = Number(jwt.verify(token, config.jwt.secret).sub);
    next();
  } catch {
    next(new HttpError(401, 'Sesi login berakhir, silakan masuk lagi'));
  }
}
