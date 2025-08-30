import mongoose,{Schema} from "mongoose";

const sellerProductSchema = new Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
},{timestamps:true})

export const SellerProduct = mongoose.model('SellerProduct',sellerProductSchema)