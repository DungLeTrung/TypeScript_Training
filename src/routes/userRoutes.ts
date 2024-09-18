import express from 'express';
import userController from '../admin/user/user.controller';

const userRouter = express.Router();

userRouter.post('/create-invite', userController.createInvite);   

userRouter.get('/list-users', userController.listUsers);   

userRouter.put('/detail-users', userController.detailUser);   

userRouter.delete('/update-user/:id', userController.updateUser);   

userRouter.get('/delete-user/:id', userController.deleteUser);   


export default userRouter;