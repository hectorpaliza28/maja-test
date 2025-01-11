import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export const MainDataSource = new DataSource({
    type : 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    extra: {
        ssl : true
    }
});