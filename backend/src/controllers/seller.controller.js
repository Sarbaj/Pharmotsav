import { Seller } from '../models/seller.model.js';
import jwt from 'jsonwebtoken'
import {normalizedLocationfunc} from '../utils/userCommonMethods.js'
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponce} from '../utils/ApiResponce.js';
import mongoose from 'mongoose';
import {SellerProduct} from '../models/sellerProduct.model.js'


//genarate a tokens for seller
const genarateRefreshToken_genarateAccessToken_for_seller=async(userid)=>{

    try {
        const seller=await Seller.findById(userid)
        if(!seller) throw new ApiError(404,'Buyer not found while genrating usertokens')

        const accessToken=await seller.generateAccessToken()
        const refreshToken=await seller.generateRefreshToken()

        seller.refreshToken=refreshToken
        await seller.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,'Something went wrong while genrating usertokens')
    }
}

//register seller
const registerSeller = asyncHandler(async(req,res)=>{

    const {firstName,lastName,email,mobileNumber,password,country,natureOfBusiness,CompanyName,licenseNumber,gstNumber,location} = req.body

    if(!firstName || !lastName || !email || !mobileNumber || !country || !password || !location || !CompanyName || !licenseNumber || !gstNumber){
        throw new ApiError(401,'All fields are required')
    }

    const normalizedLocation = normalizedLocationfunc(location) 
    if(!normalizedLocation){
        throw new ApiError(500,'something wrong while generationg normalizelocation')
    }

    //cheak if seller already exists
        const existingSeller = await Seller.findOne({
            $or: [{ email }, { mobileNumber },{ licenseNumber}, {gstNumber}]
        })
         if (existingSeller) {
        throw new ApiError(409, 'Seller with this email or mobileNumber or gstNumber or licenseNumber already exists');
    }

    //create seller
    const seller= await Seller.create({
        firstName,
        lastName,
        email,
        mobileNumber,
        country,
        natureOfBusiness,
        password,
        CompanyName,
        licenseNumber,
        gstNumber,
        location:normalizedLocation,
        status:'pending'
    })

    //see if seller is created or not
    const newSeller = await Seller.findById(seller._id).select('-password -refreshToken')
    if (!newSeller) {
        throw new ApiError(500, 'Something went wrong while creating buyer');
    }

    //return responce
    return res.status(201)
            .json(new ApiResponce(201,'sellere registerd successfully..',newSeller))


})


//login seller
const loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //cheak if field are provided
    if (!email || !password) {
        throw new ApiError(400, 'Please provide all required fields');
    }

    //cheak if buyer exists
    const seller = await Seller.findOne({ email })
    if (!seller) {
        throw new ApiError(404, 'Buyer not found with this email');
    }

    //cheak if password is correct
    const isPasswordMatched = await seller.isPasswordCorrect(password)
    if (!isPasswordMatched) {
        throw new ApiError(401, 'Invalid credentials');
    }

    //genarate accessToken and refreshToken
    const {accessToken,refreshToken}=await genarateRefreshToken_genarateAccessToken_for_seller(seller._id)

    //return buyer
     const loggedInSeller=await Seller.findById(seller._id).select('-password -refreshToken')

     const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
              .cookie('refreshToken',refreshToken,options)
              .cookie('accessToken',accessToken,options)
              .json(new ApiResponce(200, 'Seller logged in successfully', {seller:loggedInSeller,accessToken, refreshToken}));
})

//logout seller
const logoutSeller=asyncHandler(async(req,res)=>{
    
    await Seller.findByIdAndUpdate(req.seller._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )
     const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponce(200,{},'Seller LoggedOut'))
     
})


//refresh access token for seller
const refreshAccessTokenSeller=asyncHandler(async(req,res)=>{

    //take refreshToken from request
    const incomingRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,'no incoming refreshToken')
    }
   
   try {

     //decode data from it
    const data= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

     //use id to fetch the buyer
     const seller=await Seller.findById(data?._id)
 
     if(!seller){
         throw new ApiError(401,'invalid refreshToken')
     }
 
     //cheak if the buyer have same refreshToken or not

     if(incomingRefreshToken !== seller?.refreshToken){
         throw new ApiError(401,'refreshToken dosent match')
     }
 
     const options={
         httpOnly:true,
         secure:true
     }
     const {accessToken,refreshToken}=await genarateRefreshToken_genarateAccessToken_for_seller(seller._id)
 
     const newseller = await Seller.findById(seller._id).select('-password -refreshToken')
     return res.status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(new ApiResponce(200,'Token refresh successfully',{
             seller,
             accessToken,
             refreshToken
         }))
   } catch (error) {
        throw new ApiError(500,error?.message||'Invalid refreshToken')
   }
})

//change seller  Password
const changeSellerCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    if(!oldPassword || !newPassword){
        throw new ApiError(401,'Both field are required (passwords)')
    }
  
    const seller= await Seller.findById(req.seller?._id)
   
    if(!seller){
        throw new ApiError(401, "loggedIn first to change password")
    }
    const ispasswordValid= await seller.isPasswordCorrect(oldPassword)

    if(!ispasswordValid){
        throw new ApiError(401,"password should correct")
    }

    seller.password=newPassword
    await seller.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponce(200,'password change successfully...',{}))
})

//
//change forgotten password
const changeSellerForgotedPassword = asyncHandler(async(req,res)=>{
    
    const {newPassword, isVarified} =req.body

    if(!isVarified){
        throw new ApiError(401,"buyer is not varified")
    }
    if(!newPassword){
        throw new ApiError(401,"field is required")
    }
    const seller = await Seller.findById(req.seller?._id)
    if(!seller){
        throw new ApiError(401, "loggedIn first to change password")
    }

    seller.password=newPassword
    await seller.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponce(200,"password chagne successfully..",{}))

})

//update seller Profile
const updateSellerProfile = asyncHandler(async(req,res)=>{
    const {firstName,lastName,email,mobileNumber,country,natureOfBuisness,CompanyName,licenseNumber,gstNumber,location}=req.body

     if(!firstName || !lastName || !email || !mobileNumber || !country || !location || !CompanyName || !licenseNumber || !gstNumber){
        throw new ApiError(401,'All fields are required')
    }
    //normalized location
    const normalizedLocation = normalizedLocationfunc(location) 

    const seller = await Seller.findByIdAndUpdate(req.seller?._id,{
        firstName,
        lastName,
        email,
        mobileNumber,
        country,
        natureOfBuisness,
        CompanyName,
        licenseNumber,
        gstNumber,
        location:normalizedLocation,
        status:'pending'
    },{
        new:true,
    }).select('-password -refreshToken')

    return res.status(200).json(new ApiResponce(200,'Seller profile updated successfully',seller))

})

//get current seller
const getCurrentSeller=asyncHandler(async(req,res)=>{

    const seller=await Seller.findById(req.seller?._id).select('-password -refreshToken')

    if(!seller){
        throw new ApiError(404,'User not found')
    }
    return res.status(200).json(new ApiResponce(200,'Current seller fetched successfully',seller))
})

//get seller all products
const getSellerAllProducts = asyncHandler(async(req,res)=>{
    const sellerId = new mongoose.Types.ObjectId( req.seller?._id)

    const products = await Seller.aggregate([
        {
            $match:{
                _id:sellerId
            }
        },
        {
            $lookup:{
                from:'products',
                localField:'product',
                foreignField:'_id',
                as:'productDetails'
            }
        },{
            $unwind:'$productDetails'
        },
        {
            $project:{
                _id:"$productDetails._id",
                name:"$productDetails.productName",
                image:"$productDetails.productImage"
            }
        }
    ])

    return res.status(200)
              .json(new ApiResponce(200,"product featched successfully..",products))


})

export{
    registerSeller,
    loginSeller,
    logoutSeller,
    refreshAccessTokenSeller,
    changeSellerCurrentPassword,
    changeSellerForgotedPassword,
    updateSellerProfile,
    getCurrentSeller,
    getSellerAllProducts
}