import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name:{
        type: String,
        unique: true
    },
    email: {
        type: String,
        required:[true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contrasena es requerida"],
        minLenght: [8, "Cannot overcome 8 characters"]
    },
    phone:{
        type: String,
        minLenght: 8,
        maxLenght: 8,
    },
    role:{
        type: String,
        required: true,
        enum: ["ADMIN_ROLE","CLIENT_ROLE"]
    },
    estado:{
        type: Boolean,
        default: true
    }
},
    {
        timestamps:true,
        versionKey: false
    }
);

UserSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario}=this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);