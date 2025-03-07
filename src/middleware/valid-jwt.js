import jwt from 'jsonwebtoken';

import user from '../user/user.model.js';

export const validarJWT = async(req, res, next) =>{

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.MASTERKEY);

        const usuario = await user.findById(uid);


        if(!usuario){
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            })
        }

        if(!usuario.status){
            return res.status(401).json({
                msg:'Token no valido - usuarios con estado : false'
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}