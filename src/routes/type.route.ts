import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import typeController from '../module/type/type.controller';

const typeRouter = express.Router();

typeRouter.post('/create-type',  protectedRoute(['ADMIN']), typeController.createType);   

typeRouter.get('/list-types',  protectedRoute(['ADMIN']), typeController.listTypes);   

typeRouter.put('/edit-type',  protectedRoute(['ADMIN']), typeController.editType);   

typeRouter.put('/hiding-type/:id',  protectedRoute(['ADMIN']), typeController.hidingType);   


export default typeRouter;