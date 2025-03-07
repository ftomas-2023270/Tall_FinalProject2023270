import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) =>{
    try {
        const {limite = 10, desde = 0} = req.query;
        const query = {estado : true};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async(req,res)=>{
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            })
        }

        res.status(200).json({
            success : true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const updateUser = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const {password,email, ...data }= req.body;

        if(password){
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg:'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error al actualizar usuario',
            error
        })
    }
}

export const deleteCat = async(req,res)=>{
    try {
        
        const {id} = req.params;

        const user = await User.findByIdAndUpdate(id, {estado: false},{new: true});

        const authenticateUser = req.user;

        res.status(200).json({
            succes : true,
            msg: 'Usuario desactivado',
            user,
            authenticateUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}

