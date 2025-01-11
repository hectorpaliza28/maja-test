import { Router, Request, Response, NextFunction } from 'express';
import { registrarUsuario, login, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { registerValidation } from '../validators/user.validators';
import { validationResult } from 'express-validator';

const router = Router();
router.post('/registro', registerValidation, (req: Request, res: Response, next: NextFunction): void => {
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: validator.array()
        });

        return;
    }

    next();
}, registrarUsuario);

router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;