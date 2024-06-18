import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import auth from '../middleware/auth';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';
dotenv.config();

const userRouter = Router();

const validateUsername = (username: string): string => {
    if (username.length < 3) {
        return 'Username must be at least 3 characters long.';
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
        return 'Username can only contain letters and numbers.';
    }
    return '';
};

const validatePassword = (password: string): string => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.';
    }
    return '';
};

userRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password, confirmPassword } = req.body;

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    if (usernameError) {
        return res.status(400).send({ usernameError });
    }
    if (passwordError) {
        return res.status(400).send({ passwordError });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ passwordError: 'Passwords do not match' });
    }

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
        const userResult = await usersCollection.insertOne(newUser);

        const newCharacter = {
            userId: userResult.insertedId.toString(),
            level: 1,
            experience: 0,
            gold: 0,
            attackChances: 0,
            attackDamage: 1,
            equipment: []
        };
        const characterResult = await charactersCollection.insertOne(newCharacter);

        await usersCollection.updateOne(
            { _id: userResult.insertedId },
            { $set: { characterId: characterResult.insertedId } }
        );

        const payload = { userId: userResult.insertedId.toString() };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

userRouter.post('/login', async (req: Request, res: Response) => {
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

userRouter.get('/character', auth, async (req: Request, res: Response) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const charactersCollection = db.collection('characters');

        const user = await usersCollection.findOne({ _id: new ObjectId((req as any).user.userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const character = await charactersCollection.findOne({ _id: new ObjectId(user.characterId) });
        if (!character) {
            return res.status(404).send('Character not found');
        }

        res.send({
            ...character,
            username: user.username
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

userRouter.put('/character', auth, async (req: Request, res: Response) => {
    const updates = req.body;

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const charactersCollection = db.collection('characters');

        const user = await usersCollection.findOne({ _id: new ObjectId((req as any).user.userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const character = await charactersCollection.findOne({ _id: new ObjectId(user.characterId) });
        if (!character) {
            return res.status(404).send('Character not found');
        }

        await charactersCollection.updateOne(
            { _id: new ObjectId(user.characterId) },
            { $set: updates }
        );

        const updatedCharacter = await charactersCollection.findOne({ _id: new ObjectId(user.characterId) });
        res.send(updatedCharacter);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default userRouter;