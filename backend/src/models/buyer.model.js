import mongoose,{Schema} from "mongoose";
import { PASSWORD_BCRYPT_ROUNDS } from "../costants";
import { isPasswordCorrect,generateAccessToken,generateRefreshToken } from "../utils/userCommonMethods";

const buyerSchema=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    natureOfBuisness:{
        type:String,
        enum:['Pharmacy','Hospital','Agent','Distributors','Manufacturer','Other'],
        default:'Pharmacy'
    }


},{timestamps:true});


//add pre function to encrypt password
buyerSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,PASSWORD_BCRYPT_ROUNDS)
    next()
})

//add method for buyer to cheak password
buyerSchema.methods.isPasswordCorrect=isPasswordCorrect

//add method for buyer to generate accessToken
buyerSchema.methods.generateAccessToken=generateAccessToken

//add method for buyer to generatte refreshToken
buyerSchema.methods.generateRefreshToken=generateRefreshToken


export const Buyer = mongoose.model('Buyer',buyerSchema)

