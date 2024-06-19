import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';
dotenv.config();

const createTask = async (req: Request, res: Response) => {
    const { description, estimatedTime, type } = req.body;
    const userId = (req as any).user.userId;

    const newTask = {
        userId,
        description,
        estimatedTime,
        countdown: estimatedTime,
        completed: false,
        type,
        createdAt: new Date()
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
};

const getTasks = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        const tasks = await tasksCollection.find({ userId }).toArray();

        res.send(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const getTaskById = async (req: Request, res: Response) => {
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
};

const updateTask = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const taskId = req.params.id;
    const updates = req.body;

    try {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');
        const charactersCollection = db.collection('characters');

        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        let goldReward = 0;
        if (updates.completed && !task.completed) {
            goldReward = Math.max(1, Math.floor(task.estimatedTime / 5));

            await charactersCollection.updateOne(
                { userId: userId },
                {
                    $inc: {
                        attackChances: 1,
                        gold: goldReward
                    }
                }
            );
        }

        await tasksCollection.updateOne({ _id: new ObjectId(taskId) }, { $set: updates });

        const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId });
        res.send({ ...updatedTask, goldReward });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const deleteTask = async (req: Request, res: Response) => {
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
};

export default {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};