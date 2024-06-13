import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening from port ${port}`);
});