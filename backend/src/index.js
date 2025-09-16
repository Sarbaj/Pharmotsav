import 'dotenv/config';
import app from './app.js';
import connectDB from './db/db.js';

connectDB()
    .then(()=>{
        app.on('error',(err)=>{
            console.log('Error by app on : ',err);
            throw err;
        })

        app.listen(process.env.PORT || 3000,()=>{
            console.log('server is ready on port: ',process.env.PORT)
        })
    })
    .catch((err)=>{
        console.log('Error from catch by promise: ',err)
    })