import express from 'express';
import authRouter from './routes/authRoutes';
import * as dotenv from 'dotenv'
import connectDB from "./config/database"

dotenv.config()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use('/v1/auth', authRouter)
const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})