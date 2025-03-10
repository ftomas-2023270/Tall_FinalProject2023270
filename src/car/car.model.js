import { Schema,model } from "mongoose";

const Car = Schema({
    client:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Must have a valid User']
    },
    items:[{
        type: Schema.Types.ObjectId,
        ref: 'product',
        nameP: String,
        cant: Number,
        price: Number,
        subTotal: Number
    }],
    total:{
        type: Number,
        required:[true, 'Must have a total']
    }
})

export default model('Cart', Car);