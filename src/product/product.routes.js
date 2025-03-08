import { Router } from "express";
import { saveProduct,updateProduct,getProduct,searchProduct,deleteProduct } from "./product.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { tieneRole } from "../middleware/valid-role.js";
import { check } from "express-validator";


const productRouter= Router();

productRouter.get('/',tieneRole("ADMIN_ROLE","CLIENT_ROLE"),getProduct);

productRouter.get('/:id',
    [
        tieneRole("ADMIN_ROLE","CLIENT_ROLE"),
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    searchProduct);

productRouter.post(
    '/',
    [
        tieneRole("ADMIN_ROLE"),
        validarJWT,
        validarCampos
    ],
    saveProduct
)

productRouter.put(
    '/:id',
    [
        tieneRole("ADMIN_ROLE"),
        check("id","Must be a valid ID").isMongoId(),
        validarJWT,
        validarCampos
    ],
    updateProduct
)

productRouter.delete(
    '/:id',
    [
        tieneRole("ADMIN_ROLE"),
        check("id","Must be a valid ID").isMongoId(),
        validarJWT,
        validarCampos
    ],
    deleteProduct)

export default productRouter;