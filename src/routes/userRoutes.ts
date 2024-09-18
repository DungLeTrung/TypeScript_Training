import express from 'express';
import userController from '../admin/user/user.controller';

const userRouter = express.Router();

userRouter.post('/create-invite', userController.createInvite);   

userRouter.get('/list-users', userController.listUsers);   

userRouter.get('/detail-user/:id', userController.detailUser);   

userRouter.put('/update-user', userController.updateUser);   

userRouter.delete('/delete-user/:id', userController.deleteUser);   


export default userRouter;