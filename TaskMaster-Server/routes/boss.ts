import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import auth from '../middleware/auth';
import { connectDB } from '../db';
import dotenv from 'dotenv';
dotenv.config();

const bossRouter = Router();

function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch Current Boss
bossRouter.get('/boss', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const bossesCollection = db.collection('bosses');
        const charactersCollection = db.collection('characters');

        const character = await charactersCollection.findOne({ userId });

        if (!character) {
            return res.status(404).send('Character not found');
        }

        const boss = await bossesCollection.findOne({ level: character.level });

        if (!boss) {
            return res.status(404).send('Boss not found');
        }

        res.send(boss);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update Boss Health on Attack
bossRouter.put('/boss/:id/attack', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const bossId = req.params.id;
    const { damage } = req.body;

    try {
        const db = await connectDB();
        const bossesCollection = db.collection('bosses');
        const charactersCollection = db.collection('characters');

        const character = await charactersCollection.findOne({ userId });

        if (!character) {
            return res.status(404).send('Character not found');
        }

        const boss = await bossesCollection.findOne({ _id: new ObjectId(bossId) });

        if (!boss) {
            return res.status(404).send('Boss not found');
        }

        const updatedHealth = boss.healthPoints - damage;

        if (updatedHealth <= 0) {
            // Boss is defeated
            await bossesCollection.deleteOne({ _id: new ObjectId(bossId) });

            // Update character experience, level, and attack power
            const updatedExperience = character.experience + boss.rewardExp;
            const levelUp = updatedExperience >= character.level * 10; // Example level up condition

            const updatedCharacter = {
                $set: {
                    experience: updatedExperience,
                    level: levelUp ? character.level + 1 : character.level,
                    attackDamage: levelUp ? character.attackDamage + 2 : character.attackDamage,
                    gold: character.gold + boss.rewardGold,
                },
            };

            await charactersCollection.updateOne({ userId }, updatedCharacter);

            res.send({ message: 'Boss defeated', bossDefeated: true });
        } else {
            // Update boss health
            await bossesCollection.updateOne(
                { _id: new ObjectId(bossId) },
                { $set: { healthPoints: updatedHealth } }
            );

            res.send({ message: 'Boss attacked', healthPoints: updatedHealth });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Fetch New Boss (Boss level equals character level)
bossRouter.post('/boss/new', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const bossesCollection = db.collection('bosses');
        const charactersCollection = db.collection('characters');

        const character = await charactersCollection.findOne({ userId });

        if (!character) {
            return res.status(404).send('Character not found');
        }

        const level = character.level;
        const healthPoints = level * 10 + getRandomIntInclusive(1, level * 2);
        const rewardExp = level * 2 + getRandomIntInclusive(1, level);
        const rewardGold = level * 5 + getRandomIntInclusive(1, level * 2);

        const newBoss = {
            level,
            healthPoints,
            rewardExp,
            rewardGold
        };

        const result = await bossesCollection.insertOne(newBoss);
        const createdBoss = await bossesCollection.findOne({ _id: result.insertedId });

        res.status(201).send(createdBoss);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default bossRouter;