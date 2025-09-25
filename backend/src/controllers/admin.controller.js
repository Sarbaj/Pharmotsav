import { Admin } from "../models/admin.model.js";
import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponce} from '../utils/ApiResponce.js';

//function to genarate accessToken and refreshToken for admin
const genarateRefreshToken_genarateAccessToken_for_admin=async(userid)=>{

    try {
        const admin=await Admin.findById(userid)
        if(!admin) throw new ApiError(404,'Admin not found while genrating usertokens')

        const accessToken=await admin.generateAccessToken()
        const refreshToken=await admin.generateRefreshToken()

        admin.refreshToken=refreshToken
        await admin.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,'Something went wrong while genrating usertokens')
    }
}

//admin register controller
const memberRegisterController=asyncHandler(async(req,res,next)=>{
    const {name,email,password}=req.body

    //cheak if admin already exist with the email
    const existingAdmin=await Admin.findOne({email})
    if(existingAdmin){
        console.log(existingAdmin);
        throw new ApiError(400,'Admin already exist with this email')
    }
        

    //create new admin
    const newAdmin=await Admin.create({
        name,
        email,
        password,
        role:'member'
    })

    //send responce
    return res.status(201).json(new ApiResponce(201,'member registered successfully',{admin:newAdmin})
    )

})

//admin login controller
const adminLoginController=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body

    //cheak if admin exist with the email
    const admin=await Admin.findOne({email})
    if(!admin) throw new ApiError(404,'Admin not found with this email')
    //cheak if password is correct
    const isPasswordMatched=await admin.isPasswordCorrect(password)
    if(!isPasswordMatched) throw new ApiError(401,'Invalid credentials')
    //genarate accessToken and refreshToken for admin
    const {accessToken,refreshToken}=await genarateRefreshToken_genarateAccessToken_for_admin(admin._id)
    //send responce
    const options={
        httpOnly:true,
        secure:true

    }

    return res.status(200)
              .cookie('refreshToken',refreshToken,options)
              .cookie('accessToken',accessToken,options)
              .json(new ApiResponce(200, 'admin logged in successfully', {admin:admin,accessToken, refreshToken,role:admin.role}));

})

//admin logout controller
const adminLogoutController=asyncHandler(async(req,res,next)=>{
    //find admin and remove refreshToken
    await Admin.findByIdAndUpdate(req.admin?._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )

    //send responce
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponce(200,'admin LoggedOut',{}))
})

//member logout controller
const memberLogoutController = asyncHandler(async(req,res,next)=>{
    //find admin and remove refreshToken
    await Admin.findByIdAndUpdate(req.member?._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )

    //send responce
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponce(200,'member LoggedOut',{}))
})

//remove member controller
const removeMemberController=asyncHandler(async(req,res,next)=>{
    const {memberId}=req.body

    //cheak if memberId is provided
    if(!memberId) throw new ApiError(400,'Please provide memberId')

    //find member and remove
    const member=await Admin.findById(memberId)
    if(!member) throw new ApiError(404,'Member not found with this id')
    if(member.role!=='member') throw new ApiError(400,'You can not remove admin')

    const deleted = await Admin.findByIdAndDelete(memberId)
    if(!deleted) throw new ApiError(500,'Something went wrong while removing member')

    //send responce
    return res.status(200).json(new ApiResponce(200,'Member removed successfully',{}))
})

//get all members controller
const getAllMembersController=asyncHandler(async(req,res,next)=>{
    const members=await Admin.find({role:'member'}).select('-password -refreshToken')
    if(!members) {throw new ApiError(404,'No members found')}
    return res.status(200)
              .json(new ApiResponce(200,'All members fetched successfully',{members}))
})
export {
    memberRegisterController,
    adminLoginController,
    adminLogoutController,
    removeMemberController,
    getAllMembersController,
    memberLogoutController
}