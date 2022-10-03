import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';


const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transport.sendMail({
        from: "bienes@BienesRaices.com",
        to: data.email,
        subject: "Confirma tu cuenta en Bienes Raices",
        text: "Confirma tu cuenta en Bienes Raices",
        html: `
            <p>Hola ${data.name}</p>
            <p>Confirma tu cuenta en Bienes Raices</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla pulsando en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/auth/confirm/${data.token}">Confirmar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este correo.</p>
        `
    });

}

const emailForgotPass = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transport.sendMail({
        from: "bienes@BienesRaices.com",
        to: data.email,
        subject: "Reestablece tu contraseña en Bienes Raices",
        text: "Reestablece tu contraseña en Bienes Raices",
        html: `
            <p>Buenas ${data.name}, Se ha solicitado restaurar tu contraseña en Bienes Raices</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla pulsando en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/auth/forgot/${data.token}">Restablecer Contraseña</a></p>
            <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este correo.</p>
        `
    });
}


export {
    registerEmail,
    emailForgotPass
}