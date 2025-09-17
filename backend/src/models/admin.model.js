import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import { PASSWORD_BCRYPT_ROUNDS } from "../costants.js";
import { isPasswordCorrect,generateAccessToken,generateRefreshToken } from "../utils/userCommonMethods.js";

const adminSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','member'],
        default:'member'
    }

},{timestamps:true});

//add method for admin to cheak password
adminSchema.methods.isPasswordCorrect=isPasswordCorrect

//add method for admin to generate accessToken
adminSchema.methods.generateAccessToken=generateAccessToken

//add method for admin to generatte refreshToken
adminSchema.methods.generateRefreshToken=generateRefreshToken

adminSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,PASSWORD_BCRYPT_ROUNDS)
    next()
})

export const Admin = mongoose.model('Admin',adminSchema)
