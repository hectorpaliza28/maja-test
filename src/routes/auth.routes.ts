import {Router} from 'express';
import { registrarUsuario, login, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.post('/registro', registrarUsuario);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;