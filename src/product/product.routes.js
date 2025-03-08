import { Router } from "express";
import { saveProduct,updateProduct,getProduct,searchProduct,deleteProduct } from "./product.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/valid-jwt.js";
import { tieneRole } from "../middleware/valid-role.js";
import { check } from "express-validator";


const productRouter= Router();

productRouter.get('/',getProduct);

productRouter.get('/:id',
    [
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    searchProduct);

productRouter.post(
    '/',
    [
        validarJWT,
        validarCampos
    ],
    saveProduct
)

productRouter.put(
    '/:id',
    [
        check("id","Must be a valid ID").isMongoId(),
        validarJWT,
        validarCampos
    ],
    updateProduct
)

productRouter.delete(
    '/:id',
    [
        check("id","Must be a valid ID").isMongoId(),
        validarJWT,
        validarCampos
    ],
    deleteProduct)

export default productRouter;