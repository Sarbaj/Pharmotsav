import { Category } from "../models/category.model.js";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponce} from '../utils/ApiResponce.js';


//create category controller
const createCategoryController=asyncHandler(async(req,res,next)=>{
    const {categoryName,description}=req.body
    if(!categoryName) throw new ApiError(400,'Category name is required')
    //cheak if category already exist
    const existingCategory=await Category.findOne({categoryName})
    if(existingCategory) throw new ApiError(400,'Category already exist with this name')
    //create new category
    const newCategory=await Category.create({
        categoryName,
        description
    })
    //send responce
    res.status(201).json(new ApiResponce(201,'Category created successfully',newCategory))
})

//get all categories controller
const getAllCategoriesController=asyncHandler(async(req,res,next)=>{
    const categories=await Category.find().sort({createdAt:-1})
    res.status(200).json(new ApiResponce(200,'All categories fetched successfully',categories))
})



//update category
const updateCategoryController=asyncHandler(async(req,res,next)=>{
    const {categoryId,categoryName,description}=req.body
    if(!categoryId) throw new ApiError(400,'Category id is required')

    const category=await Category.findById(categoryId)
    if(!category) throw new ApiError(404,'Category not found')
    //check if category name is being updated and if it is already taken
    if(categoryName && categoryName!==category.categoryName){
        const existingCategory=await Category.findOne({categoryName})
        if(existingCategory) throw new ApiError(400,'Category name is already taken')
        category.categoryName=categoryName
    }
    if(description) category.description=description
    await category.save()
    res.status(200).json(new ApiResponce(200,'Category updated successfully',category))
})

export {
    createCategoryController,
    getAllCategoriesController,
    updateCategoryController
}