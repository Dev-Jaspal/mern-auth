import express from "express";
import mongoose from "mongoose";
import dotenv from  "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser";
import path from 'path';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() =>{
    console.log("Connect to mongodb");
})
.catch((err) =>{
    console.log(err);
});

const corsOptions = {
    origin: true, // Allow all origins dynamically
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };

const __dirname = path.resolve();
const app = express();
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// Handling the preflight request (OPTIONS) explicitly
app.options('*', cors(corsOptions));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    });
});