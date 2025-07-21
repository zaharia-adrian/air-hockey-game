import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv'; dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'postgres',
        host: "localhost",
        port: parseInt(process.env.DB_PORT),
        define: {
            underscored: true
        },
        logging: false,
    }
);


export const connectToDB = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Connected to PostgresSQL...");
        return sequelize;
    }catch(error){
        console.log(error);
    }
};