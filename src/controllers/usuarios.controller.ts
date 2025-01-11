import {Request, Response  } from 'express';
import { MainDataSource } from '../config/db.config';
import { Usuario } from '../models/usuario.entity';

export const obtenerUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRepository = MainDataSource.getRepository(Usuario);
        const usuarios = await userRepository.find();

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos con éxito',
            users: usuarios
        });
    } catch (error: any) {
        console.log('Error al obtener usuarios: ', error);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un error al obtener los usuarios',
            error: error
        });
    }
}

export const updateUsuario = async(req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        const {nombre, apellido, rol, email} = req.body;
        let datos: { nombre?: string; apellido?: string; rol?: string } = {};

        const userRepository = MainDataSource.getRepository(Usuario);
        const registroActual = await userRepository.findOneBy({ id: parseInt(id) });

        if(!registroActual){
            res.status(404).json({
                success : false,
                message : 'Usuario no encontrado'
            });

            return;
        }

        const actualizado = validarDatos(registroActual, {nombre, apellido, rol, email});
        await userRepository.save(actualizado);

        res.status(200).json({
            success : true,
            message : 'Usuario actualizado con éxito',
            usuario : {
                id : actualizado.id,
                nombre : actualizado.nombre,
                apellido : actualizado.apellido,
                email : actualizado.email,
                rol : actualizado.rol
            }
        });
    }catch(error : any){
        console.log('Error al actualizar usuario: ', error);
        res.status(500).json({
            success : false,
            message : 'Ocurrió un error al actualizar el usuario',
            error : error
        });
    }
}

export const eliminarUsuario = async(req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        const userRepository = MainDataSource.getRepository(Usuario);
        const usuario = await userRepository.findOneBy({id: parseInt(id)});

        if(!usuario){
            res.status(404).json({
                success : false,
                message : 'Usuario no encontrado'
            });

            return;
        }
        await userRepository.remove(usuario);

        res.status(200).json({
            success : true,
            message : 'Usuario eliminado con éxito'
        });
    }catch(error : any){
        console.log('Error al eliminar usuario: ', error);
        res.status(500).json({
            success : false,
            message : 'Ocurrió un error al eliminar el usuario',
            error : error
        });
    }
}

const validarDatos = (actual: Usuario, datos: { nombre?: string; apellido?: string; rol?: string; email?: string }): Usuario => {
    if(datos.nombre){
        actual.nombre = datos.nombre;
    }

    if(datos.apellido){
        actual.apellido = datos.apellido;
    }

    if(datos.rol){
        actual.rol = datos.rol;
    }

    if(datos.email){
        actual.email = datos.email;
    }

    return actual;
}