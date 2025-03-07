import { Router } from "express";
import { check } from "express-validator";
import { getUserById,updateUser,deleteCat, getUsers } from "./user.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { tieneRole } from "../middleware/valid-role.js";

const userRoutes = new Router();

userRoutes.get("/",getUsers);

userRoutes.get(
    "/findUser/:id", 
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
        tieneRole("ADMIN_ROLE","VENTAS_ROLE"),
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteCat
)

export default userRoutes;