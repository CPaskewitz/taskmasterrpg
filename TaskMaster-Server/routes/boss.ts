import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import auth from '../middleware/auth';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';
dotenv.config();

const bossRouter = Router();

interface BossMetadata {
    name: string;
    imageUrl: string;
}

function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateBossImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: "dall-e-3",
                prompt,
                n: 1,
                size: '1024x1024'
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data[0].url;
    } catch (error: any) {
        console.error('Error generating image:', error.response?.data || error.message);
        return null;
    }
};

bossRouter.get('/boss', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const bossesCollection = db.collection('bosses');
        const charactersCollection = db.collection('characters');
        const bossMetadataCollection = db.collection('bossMetadata');

        const character = await charactersCollection.findOne({ userId });

        if (!character) {
            return res.status(404).send('Character not found');
        }

        let boss = await bossesCollection.findOne({ level: character.level });

        if (!boss) {
            const level = character.level;
            const healthPoints = level * 15 + getRandomIntInclusive(5, level * 3);
            const rewardExp = Math.floor(5 + level * 2); 
            const rewardGold = level * 5 + getRandomIntInclusive(3, level * 3);

            const bossNames = [
                'Anxietyzilla',
                'Procrastination Beast',
                'Self-Doubt Specter',
                'Imposter Syndrome Ogre',
                'Lethargy Leviathan',
                'Indecision Dragon',
                'Stress Monster',
                'Fearsome Fidget',
                'Dread Demon',
                'Despair Dragon',
                'Procrastinasaurus Rex',
                'The Overthinking Ogre',
                'Dreadnought',
                'The Excuse Executioner',
                'Worrywart Wraith',
                'Major Melancholy',
                'Panic Pirate',
                'The Task-Terrifier',
                'Captain Crisis'
            ];
            const bossName = bossNames[getRandomIntInclusive(0, bossNames.length - 1)];

            let bossMetadata = await bossMetadataCollection.findOne({ name: bossName }) as BossMetadata | null;

            if (!bossMetadata) {
                const imageUrl = await generateBossImage(bossName);

                if (!imageUrl) {
                    return res.status(500).send('Error generating boss image');
                }

                bossMetadata = { name: bossName, imageUrl };
                await bossMetadataCollection.insertOne(bossMetadata);
            }

            const newBoss = {
                level,
                healthPoints,
                maxHealthPoints: healthPoints,
                rewardExp,
                rewardGold,
                name: bossMetadata.name,
                imageUrl: bossMetadata.imageUrl
            };

            const result = await bossesCollection.insertOne(newBoss);
            boss = await bossesCollection.findOne({ _id: result.insertedId });
        }

        res.send(boss);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

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
            await bossesCollection.deleteOne({ _id: new ObjectId(bossId) });

            const updatedExperience = character.experience + boss.rewardExp;
            const levelUp = updatedExperience >= 10 * (character.level ** 2); // Quadratic XP to level up

            const updatedCharacter = {
                $set: {
                    experience: updatedExperience,
                    level: levelUp ? character.level + 1 : character.level,
                    attackDamage: levelUp ? character.attackDamage + 1 : character.attackDamage,
                    gold: character.gold + boss.rewardGold,
                },
                $inc: {
                    attackChances: -1
                }
            };

            await charactersCollection.updateOne({ userId }, updatedCharacter);

            res.send({
                message: 'Boss defeated',
                bossDefeated: true,
                rewardExp: boss.rewardExp,
                rewardGold: boss.rewardGold,
                levelUp
            });
        } else {
            await bossesCollection.updateOne(
                { _id: new ObjectId(bossId) },
                { $set: { healthPoints: updatedHealth } }
            );

            await charactersCollection.updateOne({ userId }, { $inc: { attackChances: -1 } });

            res.send({ message: 'Boss attacked', healthPoints: updatedHealth });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

bossRouter.post('/boss/new', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const bossesCollection = db.collection('bosses');
        const charactersCollection = db.collection('characters');
        const bossMetadataCollection = db.collection('bossMetadata');

        const character = await charactersCollection.findOne({ userId });

        if (!character) {
            return res.status(404).send('Character not found');
        }

        const level = character.level;
        const healthPoints = level * 15 + getRandomIntInclusive(5, level * 3);
        const rewardExp = Math.floor(5 + level * 2); // Adjusted XP for bosses
        const rewardGold = level * 5 + getRandomIntInclusive(3, level * 3);

        const bossNames = [
            'Anxietyzilla',
            'Procrastination Beast',
            'Self-Doubt Specter',
            'Imposter Syndrome Ogre',
            'Lethargy Leviathan',
            'Indecision Dragon',
            'Stress Monster',
            'Fearsome Fidget',
            'Dread Demon',
            'Despair Dragon',
            'Procrastinasaurus Rex',
            'The Overthinking Ogre',
            'Dreadnought',
            'The Excuse Executioner',
            'Worrywart Wraith',
            'Major Melancholy',
            'Panic Pirate',
            'The Task-Terrifier',
            'Captain Crisis'
        ];
        const bossName = bossNames[getRandomIntInclusive(0, bossNames.length - 1)];

        let bossMetadata = await bossMetadataCollection.findOne({ name: bossName }) as BossMetadata | null;

        if (!bossMetadata) {
            const imageUrl = await generateBossImage(bossName);

            if (!imageUrl) {
                return res.status(500).send('Error generating boss image');
            }

            bossMetadata = { name: bossName, imageUrl };
            await bossMetadataCollection.insertOne(bossMetadata);
        }

        const newBoss = {
            level,
            healthPoints,
            maxHealthPoints: healthPoints,
            rewardExp,
            rewardGold,
            name: bossMetadata.name,
            imageUrl: bossMetadata.imageUrl
        };

        const result = await bossesCollection.insertOne(newBoss);
        const createdBoss = await bossesCollection.findOne({ _id: result.insertedId });

        res.status(201).send(createdBoss);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

export default bossRouter;