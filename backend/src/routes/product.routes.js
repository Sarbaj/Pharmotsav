import { Router } from 'express'
import { addProduct } from '../controllers/product.controller.js'
import { verifyJwtSeller } from '../middlewares/auth.middleware.js'

const productRouter = Router()
productRouter.route('/add-product').post(verifyJwtSeller,addProduct)

export default productRouter