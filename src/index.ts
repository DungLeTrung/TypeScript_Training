import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from "./config/database";
import authRouter from './routes/authRoutes';
import projectRouter from './routes/projectRoutes';

dotenv.config()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use('/v1/auth', authRouter)
app.use('/v1/project', projectRouter)
const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})