import { Schema, model } from "mongoose";

const Product = Schema({
    name:{
        type: String,
        required:[true, 'Product must have a name'],
        minlenght:[4,'Product name has to be more than 4 characters']
    },
    description:{
        type: String,
        minlenght:[8,'Product name has to be more than 8 characters']
    },
    cat:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true,'Must need a category to the product']
    },
    stock:{
        type: Number,
        min: [0, 'Must be a real number'],
        required: [true, 'Must initializate the stock of the product']
    },
    price:{
        type: Number,
        required: [true, 'Product must have a price']
    },
    sell:{
        type: Number,
        min: [0, 'Must be a real number']
    },
    status:{
        type:Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionkey:false
});

export default model('Product', Product);