// src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // 1. Import bcrypt untuk membandingkan password
import prisma from '../../config/prisma'; // 2. Import Prisma Client
import { CookieOptions } from 'express';

// Fungsi generateToken tidak perlu diubah, sudah bagus
const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        // 'secure' WAJIB true jika sameSite='none'
        secure: isProduction, 
        // 'sameSite' harus 'none' untuk cross-subdomain di produksi (HTTPS),
        // dan 'lax' di development untuk kemudahan (beberapa browser memblokir 'none' di http)
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        // Domain harus diatur agar cookie bisa diakses oleh semua subdomain
        domain: isProduction ? '.gegacreative.com' : undefined, 
    };

    res.cookie('jwt', token, cookieOptions);
};


// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        // 3. Cari pengguna di database berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 4. Jika pengguna ada DAN passwordnya cocok
        if (user && (await bcrypt.compare(password, user.password))) {
            generateToken(res, user.id); // Buat token dengan ID pengguna yang sebenarnya

            // Kirim kembali data pengguna tanpa password
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            // Jika pengguna tidak ada ATAU password salah, kirim pesan error yang sama
            // untuk alasan keamanan (tidak memberi tahu penyerang mana yang salah)
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// --- LOGOUT ---
export const logout = (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Opsi untuk menghapus cookie HARUS SAMA PERSIS
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        expires: new Date(0), // Atur masa kedaluwarsa ke masa lalu
        path: '/',
        domain: isProduction ? '.gegacreative.com' : undefined,
    };
    
    res.cookie('jwt', '', { ...cookieOptions, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// --- (Opsional) Fungsi untuk mendapatkan data pengguna saat ini ---
// Berguna untuk memeriksa status login di frontend
export const getCurrentUser = async (req: Request, res: Response) => {
    // Middleware 'protect' sudah menempatkan data pengguna di req.user
    // Kita hanya perlu mengambilnya dari database untuk mendapatkan data terbaru
    if (req.user) {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { // Hanya pilih data yang aman untuk dikirim
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } else {
        res.status(401).json({ message: "Not authorized." });
    }
};