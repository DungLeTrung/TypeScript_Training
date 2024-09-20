import express from 'express';
import projectController from '../../module/project/project.controller';
import { protectedRoute } from '../../middleware/protectedRoute';

const projectRouter = express.Router();

projectRouter.post('/create-project', projectController.createProject);   

projectRouter.get('/list-projects', projectController.listProjects);   

projectRouter.put('/edit-project', projectController.editProject);   

projectRouter.delete('/delete-project/:id', projectController.deleteProject);   

projectRouter.get('/detail-project/:id', projectController.detailProject);   

projectRouter.post('/:projectId/add-member', projectController.addMembersToProject);   

projectRouter.delete('/delete-member/:projectId/:userId', projectController.deleteMemberFromProject);   

projectRouter.delete('/delete-member/:projectId', projectController.deleteMembersFromProject);   


export default projectRouter;