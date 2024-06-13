import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/user';
import { connectDB } from './db';


dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.use('/api/users', router);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});