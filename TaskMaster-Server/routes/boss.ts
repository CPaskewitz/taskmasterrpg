import { Router } from 'express';
import bossController from '../controllers/bossController';
import auth from '../middleware/auth';

const bossRouter = Router();

bossRouter.get('/boss', auth, bossController.getBoss);
bossRouter.put('/boss/:id/attack', auth, bossController.attackBoss);
bossRouter.post('/boss/new', auth, bossController.createNewBoss);

export default bossRouter;