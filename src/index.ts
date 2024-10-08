import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from "./config/database";
import authRouter from './routes/auth.route';
import inviteRoute from './routes/invite.route';
import priorityRouter from './routes/priority.route';
import projectRouter from './routes/project.route';
import statusRouter from './routes/status.route';
import taskRouter from './routes/task.route';
import typeRouter from './routes/type.route';
import userRouter from './routes/user.route';

dotenv.config()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use('/v1/auth', authRouter)
app.use('/v1/project', projectRouter)
app.use('/v1/user', userRouter)
app.use('/v1/type', typeRouter)
app.use('/v1/status', statusRouter)
app.use('/v1/priority', priorityRouter)
app.use('/v1/task', taskRouter)
app.use('/v1/invite', inviteRoute)

const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})