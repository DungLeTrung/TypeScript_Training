import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import statusController from '../module/status/status.controller';

const statusRouter = express.Router();

statusRouter.post('/create-status', protectedRoute(['ADMIN']), statusController.createStatus);   

statusRouter.get('/list-statuses', protectedRoute(['ADMIN']), statusController.listStatuses);   

statusRouter.put('/edit-status',  protectedRoute(['ADMIN']), statusController.editStatus);   

statusRouter.put('/hiding-status/:id',  protectedRoute(['ADMIN']), statusController.hidingStatus);   


export default statusRouter;