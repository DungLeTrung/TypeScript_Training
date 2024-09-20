import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from "./config/database";
import authRouter from './routes/admin_route/auth.route';
import priorityRouter from './routes/admin_route/priority.route';
import projectRouter from './routes/admin_route/project.route';
import statusRouter from './routes/admin_route/status.route';
import taskRouter from './routes/admin_route/task.route';
import typeRouter from './routes/admin_route/type.route';
import userRouter from './routes/admin_route/user.route';
import authUserRouter from './routes/user_route/auth.route';
import inviteRoute from './routes/admin_route/invite.route';
import projectRouterForUser from './routes/user_route/project.route';
import taskRouterForUser from './routes/user_route/task.route';

dotenv.config()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

//Admin Routers
app.use('/v1/auth', authRouter)
app.use('/v1/admin/project', projectRouter)
app.use('/v1/admin/user', userRouter)
app.use('/v1/admin/type', typeRouter)
app.use('/v1/admin/status', statusRouter)
app.use('/v1/admin/priority', priorityRouter)
app.use('/v1/admin/task', taskRouter)
app.use('/v1/admin/invite', inviteRoute)
//User Routers
app.use('/v1/user/auth', authUserRouter)
app.use('/v1/user/project', projectRouterForUser)
app.use('/v1/user/task', taskRouterForUser)

const port = process.env.PORT || 8080

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
})