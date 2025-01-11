import {Router} from 'express';
import { obtenerUsuarios, updateUsuario, eliminarUsuario } from '../controllers/usuarios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rolMiddleware } from '../middlewares/rol.middleware';

const router = Router();

router.get('/', authMiddleware, rolMiddleware(['admin']), obtenerUsuarios);
router.put('/:id', authMiddleware, rolMiddleware(['admin']), updateUsuario);
router.delete('/:id', authMiddleware, rolMiddleware(['admin']), eliminarUsuario);

export default router;