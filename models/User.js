import { DataTypes } from "sequelize";
import db from "../config/db.js"

const User = db.define("usuarios", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
    },
    confirm: {
        type: DataTypes.BOOLEAN,
    }
});

export default User;