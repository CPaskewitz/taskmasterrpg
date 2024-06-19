import { Router } from 'express';
import userController from '../controllers/userController';
import auth from '../middleware/auth';

const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/character', auth, userController.getCharacter);
userRouter.put('/character', auth, userController.updateCharacter);

export default userRouter;