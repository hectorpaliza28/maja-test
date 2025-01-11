import {Request, Response, NextFunction} from 'express';

export const rolMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const usuario = (req as any).usuario;
        console.log('Usuario: ', usuario);
        
        if(!usuario || !roles.includes(usuario.rol)){
            res.status(403).json({
                success : false,
                message : 'No tiene permisos para realizar esta acción.'
            });
        }
        next();
    };
}