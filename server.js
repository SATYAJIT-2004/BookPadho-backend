import express from 'express'
import "./configs/env.js"

import cors from 'cors'

import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js'
import errorHandler from './middleware/errorMiddleware.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoute from './routes/adminRoute.js';
import wishlistRoutes from './routes/Wishlistroutes.js';



const app = express();
app.use(cors());
app.use(express.json());

connectDB()
app.get('/',(req,res)=>{
    res.send('Server is running....')
});

app.use("/api/auth",authRoutes)
app.use("/api/books",bookRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/admin",adminRoute)
app.use("/api/wishlist",wishlistRoutes)


//Error handler at last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on the PORT: ${PORT}`);
})

