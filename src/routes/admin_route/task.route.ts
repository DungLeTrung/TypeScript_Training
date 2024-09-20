import express from 'express';
import taskController from '../../module/task/task.controller';

const taskRouter = express.Router();

taskRouter.post('/create-task', taskController.createTask);   

taskRouter.get('/list-tasks', taskController.listTasks);   

taskRouter.put('/edit-task', taskController.editTask);   

taskRouter.delete('/delete-task/:id', taskController.deleteTask);   


export default taskRouter;