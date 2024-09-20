import express from 'express';
import priorityController from '../../module/priority/priority.controller';

const priorityRouter = express.Router();

priorityRouter.post('/create-priority', priorityController.createPriority);   

priorityRouter.get('/list-priorities', priorityController.listPriorities);   

priorityRouter.put('/edit-priority', priorityController.editPriority);   

priorityRouter.put('/hiding-priority/:id', priorityController.hidingPriority);   


export default priorityRouter;