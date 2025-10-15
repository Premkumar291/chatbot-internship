import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';

// register
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const refreshToken = generateRefreshToken(user._id);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: process.env.JWT_REFRESH_EXPIRES_IN
            });

            return res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
        return res.status(400).json({ message: 'Invalid user data' });
    } catch (err) {
        next(err);
    }
};



// login
export const logInUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const refreshToken = generateRefreshToken(user._id);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: process.env.JWT_REFRESH_EXPIRES_IN
            });

            return res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (err) {
        next(err);
    }
};

//logout
export const logOutUser = async (req, res, next) => {
    try {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        next(err);
    }
};

// profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) return res.json(user);
        return res.status(404).json({ message: 'User not found' });
    } catch (err) {
        next(err);
    }
};

// refresh token
export const refreshAccessToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(401).json({ message: 'No refresh token' });

        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error('JWT_REFRESH_SECRET not set');

        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        return res.json({ token: accessToken });
    } catch (err) {
        next(err);
    }
};