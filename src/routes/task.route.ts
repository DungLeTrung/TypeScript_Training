import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import taskController from '../module/task/task.controller';

const taskRouter = express.Router();

taskRouter.post('/create-task', protectedRoute(['USER', 'ADMIN']), taskController.createTask);   

taskRouter.put('/edit-task', protectedRoute(['USER', 'ADMIN']), taskController.editTask);   

taskRouter.delete('/delete-task/:id',  protectedRoute(['USER','ADMIN']), taskController.deleteTask);  

taskRouter.get('/list-tasks', protectedRoute(['ADMIN']), taskController.listTasks);   

taskRouter.get('/get-task/:taskId', taskController.detailTask);   

taskRouter.get('/list-tasks/project/:projectId', taskController.getTasks); 

taskRouter.get('/list-tasks/user/:userId', taskController.getTasks);

export default taskRouter;