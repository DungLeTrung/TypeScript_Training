import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import taskController from '../module/task/task.controller';

const taskRouter = express.Router();

taskRouter.post('/create-task', protectedRoute(['USER', 'ADMIN']), taskController.createTask);   

taskRouter.get('/list-tasks', protectedRoute(['ADMIN']), taskController.listTasks);   

taskRouter.put('/edit-task', protectedRoute(['USER', 'ADMIN']), taskController.editTask);   

taskRouter.delete('/delete-task/:id',  protectedRoute(['ADMIN']), taskController.deleteTask);  

taskRouter.get('/get-task/:taskId', taskController.detailTask);   

taskRouter.get('/list-tasks/:projectId', taskController.getTasksByProjectId);   

taskRouter.get('/list-tasks-by-user/:userId', taskController.getTasksByUserId);   

export default taskRouter;