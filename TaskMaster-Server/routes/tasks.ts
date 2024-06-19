import { Router } from 'express';
import taskController from '../controllers/taskController';
import auth from '../middleware/auth';

const taskRouter = Router();

taskRouter.post('/tasks', auth, taskController.createTask);
taskRouter.get('/tasks', auth, taskController.getTasks);
taskRouter.get('/tasks/:id', auth, taskController.getTaskById);
taskRouter.put('/tasks/:id', auth, taskController.updateTask);
taskRouter.delete('/tasks/:id', auth, taskController.deleteTask);

export default taskRouter;