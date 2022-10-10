import express from "express";
import userRoutes from "./routes/userRoutes.js";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import csrf from "csurf";

//Crear la app
const app_express = express();

app_express.use( express.urlencoded({ extended: true }) );
app_express.use(cookieParser());
app_express.use(csrf({cookie: true}));

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
const port = process.env.BACKEND_PORT;

app_express.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

app_express.use("/auth", userRoutes);
app_express.use("/", propertiesRoutes);
app_express.use( express.static("public") );