import express, { Request, Response } from 'express';
import { MainDataSource } from './config/db.config';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

MainDataSource.initialize().then(() => {
    console.log('Database connected');

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection error', err);
});
