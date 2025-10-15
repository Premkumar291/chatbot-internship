import jwt from 'jsonwebtoken';

export const generateRefreshToken = (userId) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined in environment');
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return jwt.sign({ id: userId }, secret, { expiresIn });
};