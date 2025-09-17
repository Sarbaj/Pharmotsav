import { Product } from "../models/product.model.js";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponce} from '../utils/ApiResponce.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'


//add product
const addProduct = asyncHandler(async(req,res)=>{
    const {productName,description,category,specification} = req.body
    if(!productName || !category){
        throw new ApiError(401,'productname and category are required...')
    }
    let parsedSpecification = [];
    if (specification) {
      try {
        parsedSpecification = JSON.parse(specification);
      } catch (err) {
        throw new ApiError(400, "Invalid specification format. Must be JSON.");
      }
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
        throw new ApiError(500,'product image file uploading faield on cloudinary')
    }

    const product = await Product.create({
        sellerId:req.seller?._id,
        productName,
        description:description || '',
        category,
        specification:parsedSpecification,
        productImage:productImageCloud?.url || ''
    })

    if(!product){
        throw new ApiError(500,'something went wrong while creating product')
    }
    
    return res.status(200)
              .json(new ApiResponce(200,'product created successfully',product))

})

//remove product
const removeProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.body
    if(!productId){
        throw new ApiError(401,'Product id not provided...')
    }
    const sellerId = req.seller?._id

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404,'Product not found...')
    }

    if(product.sellerId.toString() !== sellerId.toString()){
        throw new ApiError(403,'You are not authorized to delete this product')
    }
    
    const deleted = await Product.findByIdAndDelete(productId)

    if(!deleted){
        throw new ApiError(500,'product not deleted')
    }
    return res.status(200)
              .json(new ApiResponce(200,'Product delted Successfully...'),{})
    
})

//update product
const updateProduct = asyncHandler(async(req,res)=>{
    const {productName,description,category,specification,productId} = req.body
    if(!productName || !category || !productId){
        throw new ApiError(401,'productname and category are required...')
    }
     
    const sellerId = req.seller?._id

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404,'Product not found...')
    }

    if(product.sellerId.toString() !== sellerId.toString()){
        throw new ApiError(403,'You are not authorized to delete this product')
    }

    const newProduct = await Product.findByIdAndUpdate(productId,{
        productName,
        description,
        specification,
        category,
        sellerId,
    })

    if(!newProduct){
        throw new ApiError(500,'cant update the product')
    }
    return res.status(200)
            .json(new ApiResponce(200,'Product updated successfully...',newProduct))
})

//update product image
const updateProductImage = asyncHandler(async(req,res)=>{
    const {productId} = req.body
    if(!productId){
        throw new ApiError(401,'product id not provided...')
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
        throw new ApiError(500,'product image file uploading faield on cloudinary')
    }

    const sellerId = req.seller?._id

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404,'Product not found...')
    }

    if(product.sellerId.toString() !== sellerId.toString()){
        throw new ApiError(403,'You are not authorized to delete this product')
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId,{
        productImage:productImageCloud?.url || ''
    })

    if(!updatedProduct){
        throw new ApiError(500,'cant update the product image')
    }
    return res.status(200)
            .json(new ApiResponce(200,'Product image updated successfully...',updatedProduct))
})

// get single product with full category & seller
const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(401, "Product ID not provided...");
  }

  const product = await Product.findById(productId)
    .populate("category") // full category
    .populate("sellerId"); // full seller info

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponce(200, "Product successfully fetched..", product)
  );
});


// get all products with limited fields
const getAllProductsSimple = asyncHandler(async (req, res) => {
  const products = await Product.find({}, "_id productName productImage")
    .populate("sellerId", "firstName lastName location.city");

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  // transform data → flatten seller info
  const formattedProducts = products.map((p) => ({
    _id: p._id,
    productName: p.productName,
    productImage: p.productImage,
    sellerName: `${p.sellerId.firstName} ${p.sellerId.lastName}`,
    sellerCity: p.sellerId.location?.city || null
  }));

  return res.status(200).json(
    new ApiResponce(200, "Products successfully fetched", formattedProducts)
  );
});

//get products by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.body; // take categoryId from  bobdy

  const products = await Product.find(
    { category: categoryId }, // filter by category
    "_id productName productImage"
  ).populate("sellerId", "firstName lastName location.city");

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found in this category");
  }

  // transform data → flatten seller info
  const formattedProducts = products.map((p) => ({
    _id: p._id,
    productName: p.productName,
    productImage: p.productImage,
    sellerName: `${p.sellerId.firstName} ${p.sellerId.lastName}`,
    sellerCity: p.sellerId.location?.city || null,
  }));

  return res.status(200).json(
    new ApiResponce(200, "Products successfully fetched", formattedProducts)
  );
});



export{
    addProduct,
    removeProduct,
    updateProduct,
    updateProductImage,
    getProduct,
    getAllProductsSimple,
    getProductsByCategory
}