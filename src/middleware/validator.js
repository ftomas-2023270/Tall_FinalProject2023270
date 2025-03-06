import {body} from "express-validator"
import { validarCampos } from "./validar-campos.js"
import { existenteEmail } from "../helpers/db-validator.js"

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("email", "Must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 6 characters").isLength({min:8}),
    validarCampos
]

export const loginValidator =[
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("name").optional().isString().withMessage("Enter a valid user name"),
    body("password", "The password must be at least 8 characters").isLength({min:8}),
    validarCampos
]
/*
export const upPassValidator=[
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isString().withMessage("Enter a valid user name"),
    body("password", "The password must be at least 8 characters").isLength({min:8}),
    validarCampos
]*/