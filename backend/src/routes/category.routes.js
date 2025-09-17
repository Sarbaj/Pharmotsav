import { Router } from 'express'
import { verifyJwtMember } from '../middlewares/auth.middleware.js'
import { createCategoryController,getAllCategoriesController,removeCategoryController } from '../controllers/category.controller.js'
const categoryRouter = Router()


//only member can change category
categoryRouter.route('/add-category').post(verifyJwtMember,createCategoryController)
categoryRouter.route('/remove-category').post(verifyJwtMember,removeCategoryController)
categoryRouter.route('/get-all-categories').get(verifyJwtMember,getAllCategoriesController)

export default categoryRouter