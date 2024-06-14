import dotenv from 'dotenv';
dotenv.config({path: './.env.local'});

import express from 'express';
const app = express();
import cors from 'cors';
import userRouter from '../routes/user';
import taskRouter from '../routes/tasks';
import bossRouter from '../routes/boss';
import equipmentRouter from '../routes/equipment';
import { connectDB } from './db';
import cron from 'node-cron';

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.use('/api/users', userRouter);
app.use('/api', taskRouter);
app.use('/api', bossRouter);
app.use('/api', equipmentRouter);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    cron.schedule('* * * * *', async () => {
        const db = await connectDB();
        const tasksCollection = db.collection('tasks');

        await tasksCollection.updateMany(
            { countdown: { $gt: 0 }, completed: false },
            { $inc: { countdown: -60 } }
        );
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});