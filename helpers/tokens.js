import Jwt from "jsonwebtoken";

const generateJwt = (id, name) => { return Jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" }); }

const generateToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2);


export {
    generateToken,
    generateJwt
};