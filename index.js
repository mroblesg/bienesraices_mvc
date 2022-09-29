import express from "express";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

//Crear la app
const app_express = express();

app_express.use( express.urlencoded({ extended: true }) );

try {
    await db.authenticate();
    db.sync();
    console.log("connection sucessful");
} catch (error) {
    console.log(error);
}



app_express.set("view engine", "pug");
app_express.set("views", "./views");

//Definir puerto y arrancar proyecto
const port = 3000;

app_express.listen(port, () => {
    console.log(`el servidor está escuchando en el puerto ${port}`);
});

app_express.use("/auth", userRoutes);
app_express.use( express.static("public") );