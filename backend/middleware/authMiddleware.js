import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET not set');
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        req.user = { id: user._id, email: user.email, name: user.name };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};