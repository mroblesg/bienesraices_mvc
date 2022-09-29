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

const formForgotPass = (request, response) => {
    response.render("auth/forgotPass.pug", {
        page: "Recupera tu Aceso"
    });
};

export {
    formLogin,
    formRegister,
    formForgotPass
}