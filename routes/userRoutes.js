import express from "express";
import { confirmMail, formForgotPass, formLogin, formRegister, register, resetPass, checkToken, setNewPassword, authenticate } from "../controllers/userController.js";

const router = express.Router();


router.get("/login", formLogin);
router.post("/login", authenticate);
router.get("/register", formRegister);
router.post("/register", register);
router.get("/forgot", formForgotPass);
router.post("/forgot", resetPass);
router.get("/confirm/:token", confirmMail);
router.get("/forgot/:token", checkToken);
router.post("/forgot/:token", setNewPassword);

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