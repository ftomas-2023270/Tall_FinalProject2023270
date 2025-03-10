import { Router } from "express";
import { check } from "express-validator";
import { getUserById,updateUser,deleteUser, getUsers, changeUserRole } from "./user.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { tieneRole } from "../middleware/valid-role.js";

const userRoutes = new Router();
userRoutes.put(
    '/role/:id',
    [   
        validarJWT,
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    changeUserRole
)

userRoutes.get("/",getUsers);

userRoutes.get(
    "/:id", 
    [
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

userRoutes.put(
    '/:id',
    [
        validarJWT,
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

userRoutes.delete(
    "/:id",
    [
        validarJWT,
       // tieneRole("ADMIN_ROLE","VENTAS_ROLE"),
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default userRoutes;