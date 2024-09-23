import express from 'express';
import priorityController from '../module/priority/priority.controller';
import { protectedRoute } from '../middleware/protectedRoute';

const priorityRouter = express.Router();

priorityRouter.post('/create-priority', protectedRoute(['ADMIN']), priorityController.createPriority);   

priorityRouter.get('/list-priorities', protectedRoute(['ADMIN']), priorityController.listPriorities);   

priorityRouter.put('/edit-priority', protectedRoute(['ADMIN']), priorityController.editPriority);   

priorityRouter.get('/get-priority/:id', protectedRoute(['ADMIN']), priorityController.getPriorityById);   

priorityRouter.put('/hiding-priority/:id', protectedRoute(['ADMIN']), priorityController.hidingPriority);   


export default priorityRouter;