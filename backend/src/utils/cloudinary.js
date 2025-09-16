import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import { ApiError } from './ApiError.js';

// Configuration
cloudinary.config({ 
   
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(filepath)=>{
    try {
        //upload file to cloudinary if it is
        if(!filepath) return null
        const response=await cloudinary.uploader.upload(filepath,{
            resource_type:'auto'
        })
        fs.unlinkSync(filepath)
        console.log('file upload successfully..URL: ',response.url)
        return response

    } catch (error) {
        fs.unlinkSync(filepath)   //remove localy temporary saved file as the upload operation got failed
        throw new ApiError(500,'Error while uploading file to cloudinary') 
        return null
    }
}

const deletOnCloudinary=async(filepath)=>{
    try {
        if(!filepath) return null
        const publicId=filepath.split('/').pop().split('.')[0] //extract public id from url
        await cloudinary.uploader.destroy(publicId,{
            resource_type:'auto'
        })
        console.log('file deleted successfully..URL: ',filepath)
        return true
        
    } catch (error) {
        throw new ApiError(500,'Error while deleting file from cloudinary')
    }
}

export {uploadOnCloudinary,deletOnCloudinary}