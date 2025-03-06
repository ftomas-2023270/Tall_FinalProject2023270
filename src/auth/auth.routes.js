import { Router } from "express";
import { login,register } from "./auth.controller.js";
import { registerValidator,loginValidator} from "../middleware/validator.js"

const authRoute = new Router();

authRoute.post(
    '/login',
    loginValidator,
    login
);

authRoute.post(
    '/register',
    registerValidator,
    register
)
/*
router.put(
    '/password/:id',
    validarJWT,
    upPassValidator,
    updatePassword
)*/

export default authRoute