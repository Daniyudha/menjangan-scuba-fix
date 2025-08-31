// src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // 1. Import bcrypt untuk membandingkan password
import prisma from '../../config/prisma'; // 2. Import Prisma Client

// Fungsi generateToken tidak perlu diubah, sudah bagus
const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true hanya di server dengan HTTPS
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });

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
    // --- PERBAIKAN DI SINI ---
    // Hapus cookie dengan memberikan semua opsi yang mungkin
    // agar cocok dengan saat cookie dibuat.
    res.cookie('jwt', 'loggedout', { // Beri nilai 'loggedout' untuk kejelasan
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(0), // Atur masa kedaluwarsa ke masa lalu
        path: '/', // Tentukan path root secara eksplisit
    });

    // Kirim status sukses yang jelas
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