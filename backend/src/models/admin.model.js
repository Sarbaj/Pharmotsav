import mongoose,{Schema} from "mongoose";
import { PASSWORD_BCRYPT_ROUNDS } from "../costants";
import { isPasswordCorrect,generateAccessToken,generateRefreshToken } from "../utils/userCommonMethods";

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
    }

},{timestamps:true});

export const Admin = mongoose.model('Admin',adminSchema)
