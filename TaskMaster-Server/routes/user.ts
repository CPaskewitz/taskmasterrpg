import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth';
import { connectDB } from '../db';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const charactersCollection = db.collection('characters');

        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        const result = await usersCollection.insertOne(newUser);

        const newCharacter = {
            userId: result.insertedId.toString(),
            level: 1,
            experience: 0,
            gold: 0,
            attackChances: 0,
            attackDamage: 1,
            equipment: []
        };
        await charactersCollection.insertOne(newCharacter);

        const payload = { userId: result.insertedId.toString() };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const payload = { userId: user._id.toString() };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/character', auth, async (req: Request, res: Response) => {
    try {
        const db = await connectDB();
        const charactersCollection = db.collection('characters');

        const character = await charactersCollection.findOne({ userId: (req as any).user.userId });
        if (!character) {
            return res.status(404).send('Character not found');
        }

        res.send(character);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/character', auth, async (req: Request, res: Response) => {
    const updates = req.body;

    try {
        const db = await connectDB();
        const charactersCollection = db.collection('characters');

        const character = await charactersCollection.findOne({ userId: (req as any).user.userId });
        if (!character) {
            return res.status(404).send('Character not found');
        }

        await charactersCollection.updateOne(
            { userId: (req as any).user.userId },
            { $set: updates }
        );

        const updatedCharacter = await charactersCollection.findOne({ userId: (req as any).user.userId });
        res.send(updatedCharacter);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;