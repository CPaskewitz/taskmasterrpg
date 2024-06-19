import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import userRouter from '../routes/user';
import taskRouter from '../routes/tasks';
import bossRouter from '../routes/boss';
import equipmentRouter from '../routes/equipment';
import { connectDB } from './db';

dotenv.config();
const app = express();

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

    cron.schedule('0 0 * * *', async () => {
        try {
            const db = await connectDB();
            const tasksCollection = db.collection('tasks');

            await tasksCollection.updateMany(
                { type: 'daily' },
                { $set: { countdown: { $cond: { if: { $eq: ["$completed", true] }, then: "$estimatedTime", else: "$countdown" } }, completed: false } }
            );
            console.log('Daily tasks reset');
        } catch (error) {
            console.error('Error resetting daily tasks:', error);
        }
    });

    cron.schedule('* * * * *', async () => {
        try {
            const db = await connectDB();
            const tasksCollection = db.collection('tasks');

            await tasksCollection.updateMany(
                { countdown: { $gt: 0 }, completed: false },
                { $inc: { countdown: -60 } }
            );
            console.log('Countdown updated');
        } catch (error) {
            console.error('Error updating countdown:', error);
        }
    });

}).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});