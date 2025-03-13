import { Router } from "express";
import { check } from "express-validator";
import { addCat,updateCat,getCats,getCatById,deleteCat } from "./cat.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { tieneRole } from "../middleware/valid-role.js";
import { moveProductsToDefaultCategory } from "../middleware/valid-cat.js";

const catRoutes = new Router();

catRoutes.get("/",getCats);

catRoutes.get(
    "/:id", 
    [
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getCatById
);

catRoutes.post(
    "/", 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    addCat
);

catRoutes.put(
    '/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateCat
);

catRoutes.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        moveProductsToDefaultCategory,
        validarCampos
    ],
    deleteCat
)

export default catRoutes;