import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './auth.controller.js';

// Pemilik: Koordinator. Login dan profil pengguna.
export const authRoutes = Router();

authRoutes.post('/auth/login', controller.login);
authRoutes.get('/auth/me', requireAuth, controller.me);
