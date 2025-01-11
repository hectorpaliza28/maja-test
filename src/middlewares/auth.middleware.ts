import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import { tokenBlackList } from '../utils/token.list';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void=> {
    const header = req.headers.authorization;
    if(!header){
        res.status(401).json({
            success : false,
            message : 'No se ha proporcionado un token.'
        });

        return;
    }

    const token = header.split(" ")[1];

    if(tokenBlackList.has(token)){
        res.status(401).json({
            success : false,
            message : 'Token inválido. Ya se cerró sesión con este token.'
        });

        return;
    }

    try{
        const secret = process.env.JWT_SECRET || 'default';
        const payload = jwt.verify(token, secret);
        (req as any).usuario = payload;
        next();
    }catch(error: any){
        res.status(401).json({
            success : false,
            message : 'Token inválido',
            error : error
        });
    }

}