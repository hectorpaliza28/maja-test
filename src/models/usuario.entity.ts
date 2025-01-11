import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
    name: 'usuarios'
})
export class Usuario{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    nombre!: string;

    @Column()
    apellido!: string;
    
    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({
        default : 'user'
    })
    rol!: string;

    @Column({
        default : 1
    })
    token_version!: number;
}