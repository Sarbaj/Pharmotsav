import { Router } from 'express'
import { verifyJwtMember } from '../middlewares/auth.middleware.js'
import { createCategoryController,getAllCategoriesController,updateCategoryController,deleteCategoryController } from '../controllers/category.controller.js'
const categoryRouter = Router()


//only member can change category
categoryRouter.route('/add-category').post(verifyJwtMember,createCategoryController)
categoryRouter.route('/update-category').post(verifyJwtMember,updateCategoryController)
categoryRouter.route('/delete-category/:categoryId').delete(verifyJwtMember,deleteCategoryController)
categoryRouter.route('/get-all-categories').get(getAllCategoriesController)

export default categoryRouter