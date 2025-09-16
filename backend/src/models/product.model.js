import mongoose,{Schema}  from "mongoose";
import crypto from 'crypto'

const productSchema = new Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller',
        required:true
    },
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
    },
    specification:[
        {
            key:{
                type:String,
                required:true
            },
            value:{
                type:String,
                required:true
            }
        }
    ],
    productHash:{
        type:String,
       
    }

},{timestamps:true})

//compound unique index: same saller cant add same product
productSchema.index({
        sellerId:1,
        productHash:1
    },
    {
        unique:true
    }
)

//generate hash before saving
productSchema.pre("save",function(next){
    const productData = JSON.stringify({
        productName:this.productName,
        category:this.category,
        description:this.description,
        specification:this.specification
    })

    this.productHash= crypto.createHash("sha256").update(productData).digest("hex")
    next()
})


export const Product = mongoose.model('Product',productSchema)