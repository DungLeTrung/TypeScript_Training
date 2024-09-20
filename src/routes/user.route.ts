import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import userController from '../module/user/user.controller';

const userRouter = express.Router();

userRouter.post('/create-invite',  protectedRoute(['ADMIN']), userController.createInvite);   

userRouter.get('/list-users',  protectedRoute(['ADMIN']), userController.listUsers);   

userRouter.get('/detail-user/:id',  protectedRoute(['ADMIN']), userController.detailUser);   

userRouter.put('/update-user',  protectedRoute(['ADMIN']), userController.updateUser);   

userRouter.delete('/delete-user/:id',  protectedRoute(['ADMIN']), userController.deleteUser);   


export default userRouter;