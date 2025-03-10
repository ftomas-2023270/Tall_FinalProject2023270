import { Router } from "express";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { addToCart,editCart,confirmPurchase, removeFromCart } from "./car.controller.js";
import { check } from "express-validator";
import { validStock } from "../middleware/valid-stock.js";

const cartRoute = new Router();

cartRoute.post(
    '/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        check("productId","Must be a valid ID").isMongoId(),
        validStock,
        validarCampos
    ],
    addToCart
)

cartRoute.put(
    '/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        check("productId","Must be a valid ID").isMongoId(),
        validStock,
        validarCampos
    ],
    editCart    
)

cartRoute.post(
    '/confirm/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    confirmPurchase
)

cartRoute.delete(
    '/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        check("productId","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    removeFromCart
)

export default cartRoute;