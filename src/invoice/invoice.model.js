import { Schema, model } from "mongoose";

const Invoice = Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Must have a valid ID'],
    },
    date:{
        type: Date,
        default: now()
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
        required: [true,'Must have the total']
    }
})