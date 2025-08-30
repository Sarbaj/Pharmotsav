import { Product } from "../models/product.model.js";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponce} from '../utils/ApiResponce.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'


//add product
const addProduct = asyncHandler(async(req,res)=>{
    const {productName,description,category} = req.body
    if(!productName || !category){
        throw new ApiError(401,'productname and category are required...')
    }
    //get productImage
    let productImageLocalPath
    if(req.files && Array.isArray(req.files.productImage) && req.files.productImage.length > 0){
         productImageLocalPath=req.files.productImage[0].path
    }

    if(!productImageLocalPath){
        throw new ApiError(401,'local image not found')
    }

    //upload photo  to cloudinary
    const productImageCloud=await uploadOnCloudinary(productImageLocalPath)

    if(!productImageCloud){
        throw new ApiError(500,'video file uploading faield on cloudinary')
    }

    const product = await Product.create({
        productName,
        description:description || '',
        category,
        productImage:productImageCloud?.url || ''
    })

    if(!product){
        throw new ApiError(500,'something went wrong while creating product')
    }

    return res.status(200)
              .json(new ApiResponce(200,'product created successfully',product))

})

export{
    addProduct
}