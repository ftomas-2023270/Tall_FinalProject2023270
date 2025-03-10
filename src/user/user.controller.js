import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const userRequestingChange = req.usuario;  // The authenticated user making the request

        // Check if the authenticated user has the ADMIN_ROLE
        if (userRequestingChange.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "You do not have permission to change other users' roles"
            });
        }

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Check if the user is already an ADMIN_ROLE
        if (user.role === "ADMIN_ROLE") {
            return res.status(400).json({
                success: false,
                msg: "User is already an admin"
            });
        }

        // Change the role to ADMIN_ROLE
        const updateUser = await User.findByIdAndUpdate(id, { role: "ADMIN_ROLE" }, { new: true });

        res.status(200).json({
            success: true,
            msg: "User role updated to ADMIN_ROLE",
            updateUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating user role",
            error: error.message
        });
    }
};
export const getUsers = async (req = request, res = response) =>{
    try {
        const {limite = 10, desde = 0} = req.query;
        const query = {status : true};

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

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUser = req.usuario; // Usuario autenticado desde el middleware validarJWT
        const { password, email, role , ...data } = req.body;

        // Verificar si el usuario autenticado es el mismo que intenta actualizarse
        if (authenticatedUser.id !== id) {
            return res.status(403).json({
                success: false,
                msg: "Unauthorized: You can only update your own profile"
            });
        }
        if (password) {
            data.password = await hash(password);
        }

        if (role) {
            return res.status(403).json({
                success: false,
                msg: "Unauthorized: You cannot update your role "
            });
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating user",
            error: error.message
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUser = req.usuario; // Usuario autenticado desde el middleware validarJWT

        // Verificar si el usuario autenticado es el mismo que intenta eliminarse o si es ADMIN_ROLE
        if (authenticatedUser.id !== id && authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Unauthorized: You can only desactivate your own account or must be an admin"
            });
        }

        // Buscar y desactivar el usuario
        const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "User deactivated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error deactivating user",
            error
        });
    }
};

