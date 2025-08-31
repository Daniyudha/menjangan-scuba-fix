// src/server.ts
import express from 'express';
import cors from 'cors'; // Tetap impor cors
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Import semua routes Anda
import authRoutes from './api/routes/auth.routes';
import packageRoutes from './api/routes/package.routes';
import articleRoutes from './api/routes/article.routes';
import galleryRoutes from './api/routes/gallery.routes';
import testimonialRoutes from './api/routes/testimonial.routes';
import settingsRoutes from './api/routes/settings.routes';
import submissionRoutes from './api/routes/submission.routes';
import dashboardRoutes from './api/routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- PERBAIKAN UTAMA DI SINI ---
// Konfigurasi CORS yang lebih spesifik
const allowedOrigins = [
    'http://localhost:3000',
    'https://menjangan.gegacreative.com' // <-- TAMBAHKAN DOMAIN FRONTEND PRODUKSI ANDA
];

const corsOptions = {
    // Gunakan fungsi untuk memeriksa origin secara dinamis
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Izinkan permintaan tanpa 'origin' (seperti dari Postman/Insomnia)
        // atau jika origin ada di dalam daftar yang diizinkan.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Ini sangat penting untuk cookie
};

// ---------------------------------

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Menjangan Scuba Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});