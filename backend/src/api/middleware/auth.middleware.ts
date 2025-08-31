// src/api/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tambahkan properti 'user' ke tipe Request Express
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt; // <-- Baca dari cookie
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};