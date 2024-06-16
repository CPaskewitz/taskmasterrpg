import { Router, Request, Response } from 'express';
import { ObjectId, WithId, Document } from 'mongodb';
import auth from '../middleware/auth';
import { connectDB } from '../src/db';
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
        console.error('Error fetching equipment:', err);
        res.status(500).send('Server error');
    }
});

equipmentRouter.post('/shop/purchase', auth, async (req: Request, res: Response) => {
    const { equipmentId } = req.body;

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

        const equipmentItem = await equipmentCollection.findOne({ _id: new ObjectId(equipmentId) });
        if (!equipmentItem) {
            return res.status(404).send('Equipment not found');
        }

        if (character.gold < equipmentItem.cost) {
            return res.status(400).send('Not enough gold');
        }

        // Remove existing equipment of the same type
        const existingEquipment = character.equipment.find((item: any) => item.type === equipmentItem.type);
        const attackPower = equipmentItem.damageBoost || 0;

        if (existingEquipment) {
            await charactersCollection.updateOne(
                { _id: new ObjectId(user.characterId) },
                {
                    $pull: { equipment: { type: equipmentItem.type } as any },
                    $inc: { attackDamage: -existingEquipment.damageBoost }
                }
            );
        }

        await charactersCollection.updateOne(
            { _id: new ObjectId(user.characterId) },
            {
                $inc: { gold: -equipmentItem.cost, attackDamage: attackPower },
                $push: { equipment: equipmentItem as any }
            }
        );

        const updatedCharacter = await charactersCollection.findOne({ _id: new ObjectId(user.characterId) });

        res.send(updatedCharacter);
    } catch (err) {
        console.error('Server error during purchase:', err);
        res.status(500).send('Server error');
    }
});

export default equipmentRouter;