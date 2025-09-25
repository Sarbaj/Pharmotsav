import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import { PASSWORD_BCRYPT_ROUNDS } from "../costants.js";
import { isPasswordCorrect,generateAccessToken,generateRefreshToken } from "../utils/userCommonMethods.js";

const sellerSchema = new Schema({
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
    natureOfBusiness:{
        type:String,
        enum:['Pharmacy','Hospital','Agent','Distributors','Manufacturer','Other'],
        default:'Pharmacy'
    },
    CompanyName:{
        type:String,
        required:true
    },
    location: {
        address: { 
            type: String     // Street / Building
        },   
        city: { 
            type: String 
        },
        state: { 
            type: String 
        },
        country: { 
            type: String 
        },
        pincode: {
             type: String 
            },

        formattedAddress: {
             type: String    // Full address from Google Maps
            }, 
        coordinates: {
            lat: {
                 type: Number 
                },
            lng: {
                 type: Number 
                }
        },

        source: { 
            type: String, 
            enum: ["manual", "google"], 
            default: "manual" 
        }
  },
  licenseNumber:{
    type:String,
    unique:true
  },
  gstNumber:{
    type:String,
    unique:true
    },

  status:{
    type:String,
    enum:['pending','approved','rejected'],
    default:'pending'
  },
  refreshToken:{
    type:String
  }

},{timestamps:true})


//add pre function to encrypt password
sellerSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,PASSWORD_BCRYPT_ROUNDS)
    next()
})

//add method for buyer to cheak password
sellerSchema.methods.isPasswordCorrect=isPasswordCorrect

//add method for buyer to generate accessToken
sellerSchema.methods.generateAccessToken=generateAccessToken

//add method for buyer to generatte refreshToken
sellerSchema.methods.generateRefreshToken=generateRefreshToken


export const Seller = mongoose.model('Seller',sellerSchema)