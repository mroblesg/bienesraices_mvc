import express from "express";
import { formForgotPass, formLogin, formRegister, register } from "../controllers/userController.js";

const router = express.Router();


router.get("/login", formLogin);
router.get("/register", formRegister);
router.post("/register", register);
router.get("/forgot", formForgotPass);

/* 
router.route("/")
    .get((request, response) => {
        response.json({ msg: "hola mundo" });
    })
    .post((request, response) => {
        response.json({ msg: "post mundo" });
    })
 */


export default router;