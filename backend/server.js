import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/dataBase.config.js';

//importing routes
import authRoutes from './routes/auth.route.js';
import conversationRoutes from './routes/conversation.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use('/api/auth', authRoutes);
//conversation routes
app.use('/api/conversations', conversationRoutes);

app.listen(PORT, async() => {
    await connectDb();
    console.log(`Server Started and running on http://localhost:${PORT}`);
});