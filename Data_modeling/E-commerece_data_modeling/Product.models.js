import mongoose from "mongoose";
import { Category } from "./Category.models";

const productSchema = mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        typeof:String
    },
    productImage:{
        type:String
    },
    price: {
        type:Number
    },
    stock:{
        default:0,
        type:Number
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
