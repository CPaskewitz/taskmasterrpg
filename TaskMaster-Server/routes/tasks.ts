import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import auth from '../middleware/auth';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';
dotenv.config();

const taskRouter = Router();

taskRouter.post('/tasks', auth, async (req: Request, res: Response) => {
    const { description, estimatedTime } = req.body;
    const userId = (req as any).user.userId;

    const newTask = {
        userId,
        description,
        estimatedTime,
        countdown: estimatedTime,
        completed: false
    };

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.insertOne(newTask);
        const createdTask = await tasksCollection.findOne({ _id: result.insertedId });

        res.status(201).send(createdTask);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

taskRouter.get('/tasks', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const tasks = await tasksCollection.find({ userId }).toArray();

        res.send(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

taskRouter.get('/tasks/:id', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const taskId = req.params.id;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.send(task);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

taskRouter.put('/tasks/:id', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const taskId = req.params.id;
    const updates = req.body;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        await tasksCollection.updateOne({ _id: new ObjectId(taskId) }, { $set: updates });

        const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });
        res.send(updatedTask);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

taskRouter.delete('/tasks/:id', auth, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const taskId = req.params.id;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });

        res.send({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default taskRouter;