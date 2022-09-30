import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config({path: ".env"});

const db = new Sequelize(process.env.DB_NAME , process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: "mysql",
    define: {
        timestamps: true
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: "0"
});

export default db;