import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
)
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(cookieParser())
app.use(express.static('public'))

//import routes
import buyerRouter from './routes/buyer.routes.js';
import sellerRouter from './routes/seller.routes.js';
import productRouter from './routes/product.routes.js';

app.use("/api/v1/buyers",buyerRouter)
app.use("/api/v1/sellers",sellerRouter)
app.use("/api/v1/products",productRouter)


export default app