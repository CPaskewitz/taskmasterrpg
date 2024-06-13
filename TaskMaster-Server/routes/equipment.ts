import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import auth from '../middleware/auth';
import { connectDB } from '../db';
import dotenv from 'dotenv';
dotenv.config();

const equipmentRouter = Router();

equipmentRouter.get('/shop/equipment', auth, async (req: Request, res: Response) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const charactersCollection = db.collection('characters');
        const equipmentCollection = db.collection('equipment');

        const user = await usersCollection.findOne({ _id: new ObjectId((req as any).user.userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const character = await charactersCollection.findOne({ _id: new ObjectId(user.characterId) });
        if (!character) {
            return res.status(404).send('Character not found');
        }

        const equipmentItems = await equipmentCollection.find({ requiredLevel: { $lte: character.level } }).toArray();

        res.send(equipmentItems);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default equipmentRouter;