import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/dataBase.config.js';

//importing routes
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use('/api/auth', authRoutes);


app.listen(PORT , async() => {
    await connectDb()
    console.log(`Server Started abd running on http://localhost:${PORT}`);
})