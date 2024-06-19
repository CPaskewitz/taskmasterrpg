import { Router } from 'express';
import equipmentController from '../controllers/equipmentController';
import auth from '../middleware/auth';

const equipmentRouter = Router();

equipmentRouter.get('/shop/equipment', auth, equipmentController.getEquipment);
equipmentRouter.post('/shop/purchase', auth, equipmentController.purchaseEquipment);

export default equipmentRouter;