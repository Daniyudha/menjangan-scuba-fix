// src/config/multer.config.ts
import multer from 'multer';
import path from 'path';
import { Request } from 'express'; // Impor tipe Request

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file, cb) => { // Tambahkan tipe Request ke 'req'
        // --- LOGIKA BARU UNTUK MENENTUKAN AWALAN ---
        let prefix = 'file'; // Awalan default

        if (req.originalUrl.includes('/packages')) {
            prefix = 'package';
        } else if (req.originalUrl.includes('/articles')) {
            prefix = 'article';
        } else if (req.originalUrl.includes('/settings/hero')) {
            prefix = 'hero';
        } else if (req.originalUrl.includes('/settings/experience')) {
            prefix = 'experience';
        } else if (req.originalUrl.includes('/gallery')) {
            prefix = 'gallery';
        }
        // Anda bisa menambahkan 'else if' lain jika ada lebih banyak jenis upload

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Gabungkan awalan baru dengan akhiran unik dan ekstensi file asli
        cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({ storage: storage });