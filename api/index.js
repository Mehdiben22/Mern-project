import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/post.route.js' ;
import commentRoutes from './routes/comment.route.js';
import path from 'path';

dotenv.config()

mongoose.connect(process.env.MONGO)
.then(()=>
{console.log('Mongodb is connected');
})
.catch((err) =>{
    console.log(err)
});
//directory name 
const __dirname = path.resolve();

const app =express()

app.use(express.json());
//Extend cookie from the browser
app.use(cookieParser());

app.listen(3000,() => {
    console.log("Server is running on port 3000");
});

app.use('/api/user', userRoutes);
app.use('/api/auth' , authRoutes);
app.use('/api/post' , postRoutes);
app.use('/api/comment' , commentRoutes);

//static folder wich our client side we are using vite so we need to have dist 
app.use(express.static(path.join(__dirname , '/client/dist')));

//whatever we response with the file name we wanna joing de directory name and we gonna call the index.html
app.get('*' , (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


//Middleware and functions to handle errors : gerer les erreurs
app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statuscode).json({
        success : false,
        statuscode,
        message
    })
})