import mongoose,{Schema}  from "mongoose";

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    description:{
        type:String
    },
    productImage:{
        type:String
    }

},{timestamps:true})

export const Product = mongoose.model('Product',productSchema)