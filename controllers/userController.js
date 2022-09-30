import User from "../models/User.js";
import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";

const formLogin = (request, response) => {
    response.render("auth/login.pug", {
        page: "Iniciar Sesión"
    });
};

const formRegister = (request, response) => {
    response.render("auth/register.pug", {
        page: "Crear Cuenta"
    });
};

const register = async (request, response) => {
    
    //Validación
    await check("name").notEmpty().withMessage("El nombre es obligatorio").run(request);
    await check("email").isEmail().withMessage("Email debe escribirse correctamente").run(request);
    await check("password").isLength({ min: 6 }).withMessage("La contraseña debe de ser mayor a 6 caracteres").run(request);
    await check("repeat_pass").equals(request.body.password).withMessage("Ambas contraseñas deben de ser la misma").run(request);

    /* SHOWS ERROR IF FORM NOT FILLED CORRECTLY
    let result = validationResult(request);
    response.json(result.array()); */
    let result = validationResult(request);
    const existsUser = await User.findOne({ where: { email: request.body.email } });

    if (existsUser) {
        return response.render("auth/register", {
            page: "Crear cuenta",
            errors: [{msg: "El usuario ya está registrado"}],
            user: {
                name: request.body.name,
                email: request.body.email
            }
        });
    }

    if (!result.isEmpty()) {
        return response.render("auth/register", {
            page: "Crear cuenta",
            errors: result.array(),
            user: {
                name: request.body.name,
                email: request.body.email
            }
        });
    }


    const UserToRegister = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        token: generateId()
    });
    response.json(UserToRegister);

}

const formForgotPass = (request, response) => {
    response.render("auth/forgotPass.pug", {
        page: "Recupera tu Aceso"
    });
};

export {
    formLogin,
    formRegister,
    register,
    formForgotPass
}