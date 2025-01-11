import {Request, Response, NextFunction} from 'express';
import { MainDataSource } from '../config/db.config';
import { Usuario } from '../models/usuario.entity';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { tokenBlackList } from '../utils/token.list';


export const registrarUsuario = async(req: Request, res: Response): Promise<void> => {
    try{
        const {nombre, apellido, email, password} = req.body;

        if(!email || !password){
            res.status(400).json({
                success : false,
                message : 'Por favor, ingrese email y contraseña.'
            });
        }

        const hashed = await bcrypt.hash(password, 10);
        const userRepository = MainDataSource.getRepository(Usuario);
        const nuevoUsuario = await userRepository.create({
            email,
            nombre,
            apellido,
            password : hashed,
            rol : 'user'
        });
        await userRepository.save(nuevoUsuario);

        console.log('Nuevo usuario: ', nuevoUsuario);

        res.status(201).json({
            success : true,
            message : 'Usuario registrado con éxito',
            user : {
                email : nuevoUsuario.email,
                nombre : nuevoUsuario.nombre,
                apellido : nuevoUsuario.apellido,
                rol : nuevoUsuario.rol
            } 
        });
    }catch(error : any){
        console.log('Error al registrar usuario: ', error);
        res.status(500).json({
            success : false,
            message : 'Ocurrió un error al registrar el usuario',
            error : error
        });
    }
};

export const login = async(req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({
                success : false,
                message : 'Por favor, ingrese email y contraseña.'
            });
        }

        const userRepository = MainDataSource.getRepository(Usuario);
        const usuario = await userRepository.findOneBy({email});

        if(!usuario){
            res.status(404).json({
                success : false,
                message : 'Usuario no encontrado.'
            });

            return;
        }

        const match = await bcrypt.compare(password, usuario.password);
        if(!match){
            res.status(401).json({
                success : false,
                message : 'Contraseña incorrecta.'
            });
        }
        
        const token = generarJWT(usuario);
        res.status(200).json({
            success : true,
            message : 'Inicio de sesión exitoso',
            token,
            usuario : {
                id : usuario.id,
                email : usuario.email,
                nombre : usuario.nombre,
                apellido : usuario.apellido,
                rol : usuario.rol
            }
        });

    }catch(error : any){
        console.log('Error al iniciar sesión: ', error);
        res.status(500).json({
            success : false,
            message : 'Ocurrió un error al iniciar sesión',
            error : error
        });
    }
};

export const logout = async(req: Request, res: Response): Promise<void> => {
    try{
        const header = req.headers.authorization;
        if(!header){
            res.status(401).json({
                success : false,
                message : 'No se ha proporcionado un token.'
            });

            return;
        }

        const token = header.split(" ")[1];
        tokenBlackList.add(token);

        res.status(200).json({
            success : true,
            message : 'Sesión cerrada con éxito'
        });
    }catch(error : any){
        console.log('Error al cerrar sesión: ', error);
        res.status(500).json({
            success : false,
            message : 'Ocurrió un error al cerrar sesión',
            error : error
        });
    }
}

const generarJWT = (usuario: Usuario): any => {
    const payload = {
        id: usuario.id,
        rol : usuario.rol
    };

    const secret = process.env.JWT_SECRET || 'default';
    const token = jwt.sign(payload, secret, {
        expiresIn : '1h'
    });

    return token;
}