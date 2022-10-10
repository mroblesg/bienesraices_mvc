import User from "../models/User.js";
import { check, validationResult } from "express-validator";
import { generateJwt, generateToken } from "../helpers/tokens.js";
import { registerEmail, emailForgotPass } from "../helpers/email.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const formLogin = (request, response) => {
    response.render("auth/login.pug", {
        page: "Iniciar Sesión",
        csrfToken: request.csrfToken()
    });
};


const authenticate = async (request, response) => {
    
    await check("email").isEmail().withMessage("El Email es obligatorio").run(request);
    await check("password").isLength({ min: 6 }).withMessage("La contraseña es obligatoria").run(request);

    let result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/login", {
            page: "Iniciar Sesión",
            errors: result.array(),
            csrfToken: request.csrfToken()
        });
    }

    const user = await User.findOne({where: {email: request.body.email}});
    
    if (!user) {
        return response.render("auth/login", {
            page: "Iniciar Sesión",
            errors: [{msg: "El usuario no existe"}],
            csrfToken: request.csrfToken()
        });
    }

    if (user.confirm == null) {
        return response.render("auth/login", {
            page: "Iniciar Sesión",
            errors: [{msg: "Autentifica tu cuenta antes de iniciar sesión con ella"}],
            csrfToken: request.csrfToken()
        });
    }
    
    if (!user.verifyPassword(request.body.password)) {
        return response.render("auth/login", {
            page: "Iniciar Sesión",
            errors: [{msg: "La contraseña es incorrecta"}],
            csrfToken: request.csrfToken()
        });
    }

    const token = generateJwt(user.id, user.name);

    console.log(token);

    return response.cookie("_token", token, {
        httpOnly: true, //This blocks the usage of the cookies from chrome's js console.
        // secure: true, //Only allows cookies con https connections
    }).redirect("/my-properties");

};

const formRegister = (request, response) => {

    response.render("auth/register.pug", {
        page: "Crear Cuenta",
        csrfToken: request.csrfToken()
    });
};

const register = async (request, response) => {

    //Validación
    await check("name").notEmpty().withMessage("El nombre es obligatorio").run(request);
    await check("email").isEmail().withMessage("Email debe escribirse correctamente").run(request);
    await check("password").isLength({ min: 6 }).withMessage("La contraseña debe de ser mayor a 6 caracteres").run(request);
    await check("repeat_pass").equals(request.body.password).withMessage("Ambas contraseñas deben de ser la misma").run(request);

    /* 
    SHOWS ERROR IF FORM NOT FILLED CORRECTLY
    let result = validationResult(request);
    response.json(result.array()); 
    */
    let result = validationResult(request);
    const existsUser = await User.findOne({ where: { email: request.body.email } });

    if (existsUser) {
        return response.render("auth/register", {
            page: "Crear cuenta",
            errors: [{ msg: "El usuario ya está registrado" }],
            user: {
                name: request.body.name,
                email: request.body.email
            },
            csrfToken: request.csrfToken()
        });
    }

    if (!result.isEmpty()) {
        return response.render("auth/register", {
            page: "Crear cuenta",
            errors: result.array(),
            user: {
                name: request.body.name,
                email: request.body.email
            },
            csrfToken: request.csrfToken()
        });
    }

    const UserToRegister = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        token: generateToken()
    });

    registerEmail({
        name: UserToRegister.name,
        email: UserToRegister.email,
        token: UserToRegister.token
    });

    response.render("templates/message", {
        page: "Valida tu Cuenta",
        message: "Hemos enviado un email de confirmación, presiona en el enlace."
    });
};

const formForgotPass = (request, response) => {
    response.render("auth/forgotPass.pug", {
        page: "Recupera tu Aceso",
        csrfToken: request.csrfToken()
    });
};

const resetPass = async (request, response) => {
    await check("email").isEmail().withMessage("El Email debe escribirse correctamente").run(request);

    let result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/forgotPass", {
            page: "Recupera tu Aceso",
            errors: result.array(),
            user: {
                email: request.body.email
            },
            csrfToken: request.csrfToken()
        });
    }

    const existsUser = await User.findOne({ where: { email: request.body.email } });

    if (!existsUser) {
        return response.render("auth/forgotPass", {
            page: "Recupera tu Aceso",
            errors: [{ msg: "No existe una cuenta con ese Email." }],
            user: {
                email: request.body.email
            },
            csrfToken: request.csrfToken()
        });
    }

    existsUser.token = generateToken();
    existsUser.save();

    await emailForgotPass({
        email: existsUser.email,
        name: existsUser.name,
        token: existsUser.token
    });

    response.render("templates/message", {
        page: "Reestablece tu contraseña",
        message: "Hemos enviado un email con las instrucciones."
    });
};

const confirmMail = async (request, response) => {

    const user = await User.findOne({ where: { token: request.params.token } });


    if (!user) {

        response.render("auth/confirmAccount", {
            page: "Error al confirmar tu cuenta",
            message: "Hubo un error al confirmar tu cuenta, inténtalo de nuevo",
            error: true
        });

    } else {

        user.token = null;
        user.confirm = true;
        await user.save();

        response.render("auth/confirmAccount", {
            page: "Cuenta confirmada",
            message: "La cuenta ha sido confirmada de forma satisfactoria.",
            error: false
        });

    }
};

const checkToken = async (request, response) => {

    const user = await User.findOne({ where: { token: request.params.token } });

    console.log(user);
    if (!user) {
        response.render("auth/confirmAccount", {
            page: "Reestablece tu contraseña",
            message: "Hubo un error al validar tu información, inténtalo de nuevo",
            error: true
        });
    }

    response.render("auth/resetPass", {
        page: "Reestablece tu contraseña",
        csrfToken: request.csrfToken()
    });

};

const setNewPassword = async (request, response) => {

    await check("password").isLength({ min: 6 }).withMessage("La contraseña debe de ser mayor a 6 caracteres").run(request);

    let result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/resetPass", {
            page: "Reinicia tu contraseña",
            errors: result.array(),
            csrfToken: request.csrfToken()
        });
    }

    const user = await User.findOne({ where: { token: request.params.token } });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(request.body.password, salt);
    user.token = null;

    await user.save();

    response.render("auth/confirmAccount", {
        page: "Contraseña Reestablecida",
        message: "La contraseña se guardó correctamente"
    });
};


export {
    formLogin,
    formRegister,
    register,
    formForgotPass,
    confirmMail,
    resetPass,
    checkToken,
    setNewPassword,
    authenticate
};