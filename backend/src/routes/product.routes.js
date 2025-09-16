import { Router } from 'express'
import { 
    addProduct,
    removeProduct,
    updateProduct,
    updateProductImage,
    getProduct,
    getAllProductsSimple,
    getProductsByCategory
    
 } from '../controllers/product.controller.js'
import { verifyJwtSeller } from '../middlewares/auth.middleware.js'
import  {upload}  from '../middlewares/multer.middleware.js'

const productRouter = Router()

productRouter.route('/add-product').post(verifyJwtSeller,
     upload.fields([{ name: 'productImage', maxCount: 1 }]),
    addProduct)

productRouter.route('/remove-product').post(verifyJwtSeller,removeProduct)
productRouter.route('/update-product').post(verifyJwtSeller,updateProduct)

productRouter.route('/update-productImage').post(verifyJwtSeller,
     upload.fields([{ name: 'productImage', maxCount: 1 }]),
    updateProductImage)

productRouter.route('/get-product').post(getProduct)
productRouter.route('/get-all-products-simple').get(getAllProductsSimple)
productRouter.route('/get-products-by-category').post(getProductsByCategory)

export default productRouter