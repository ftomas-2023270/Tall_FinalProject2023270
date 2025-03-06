import { Schema,model } from "mongoose";

const Category = Schema({
    name:{
        type: String,
        required:[true, 'Category must have a name'],
        minlenght:[4,'Category name has to be more than 4 characters']
    },
    description:{
        type: String,
        minlenght:[8,'Category name has to be more than 8 characters']
    },
    status:{
        type:Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionkey:false
})

export default model("Cat", Category)