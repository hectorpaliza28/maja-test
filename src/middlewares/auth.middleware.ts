import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import { tokenBlackList } from '../utils/token.list';
import { MainDataSource } from '../config/db.config';
import { Usuario } from '../models/usuario.entity';

export const authMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
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
        const payload = jwt.verify(token, secret) as {id: number, rol: string, token_version: number};
        const userRepository = MainDataSource.getRepository(Usuario);
        const usuario = await userRepository.findOneBy({ id: payload.id });

        if(!usuario){
            res.status(404).json({
                success : false,
                message : 'Usuario no encontrado'
            });

            return;
        }

        if(usuario.token_version !== payload.token_version){
            res.status(401).json({
                success : false,
                message : 'El token ha sido invalidado (logout).'
            });

            return;
        }

        (req as any).usuario = payload;
        next();
    }catch(error: any){
        res.status(401).json({
            success : false,
            error : error
        });
    }

}