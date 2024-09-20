import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute';
import projectController from '../module/project/project.controller';

const projectRouter = express.Router();

projectRouter.post('/create-project', protectedRoute(['ADMIN']), projectController.createProject);   

projectRouter.get('/list-projects', protectedRoute(['ADMIN']), projectController.listProjects);   

projectRouter.put('/edit-project',protectedRoute(['ADMIN']), projectController.editProject);   

projectRouter.delete('/delete-project/:id',protectedRoute(['ADMIN']), projectController.deleteProject);   

projectRouter.get('/detail-project/:id', projectController.detailProject);   

projectRouter.post('/:projectId/add-member', protectedRoute(['ADMIN']), projectController.addMembersToProject);   

projectRouter.delete('/delete-member/:projectId/:userId', protectedRoute(['ADMIN']), projectController.deleteMemberFromProject);   

projectRouter.delete('/delete-member/:projectId', protectedRoute(['ADMIN']), projectController.deleteMembersFromProject);   

projectRouter.get('/list-projects/:id', projectController.listProjectsByUserId);   


export default projectRouter;