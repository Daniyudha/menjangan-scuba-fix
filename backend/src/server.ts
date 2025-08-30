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
const corsOptions = {
    // Izinkan hanya origin dari frontend Anda
    origin: 'http://localhost:3003', 
    // Izinkan pengiriman cookie
    credentials: true, 
};

const allowedOrigins = [
  'http://localhost:3003',        // saat dev FE
  'https://menjangan.gegacreative.com'      // domain produksi FE
];

// app.use(cors(corsOptions));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

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