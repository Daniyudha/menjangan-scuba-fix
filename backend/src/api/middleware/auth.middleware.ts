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
    const token = req.cookies.jwt; // Ambil token dari cookie bernama 'jwt'

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded; // Tambahkan data pengguna yang di-decode ke objek request
        next(); // Lanjutkan ke controller berikutnya
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};