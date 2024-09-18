import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from "./config/database";
import authRouter from './routes/authRoutes';
import projectRouter from './routes/projectRoutes';
import userRouter from './routes/userRoutes';

dotenv.config()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use('/v1/auth', authRouter)
app.use('/v1/project', projectRouter)
app.use('/v1/user', userRouter)

const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})