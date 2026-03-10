import express from "express";
import dotenv from "dotenv";
import errorHandler from "./shared/middleware/error.middleware";
import appRouter from './shared/route/app.route'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from "./shared/configs/db.config";
import { sendEmail } from "./shared/configs/email.cilent.config";


const app = express();
dotenv.config();
connectDB()

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin:process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true
}));



app.use('/api', appRouter)



app.use(errorHandler)



app.listen(process.env.PORT, () => {
  console.log("Server running on port 3001");
});