// src/api/routes/article.routes.ts
import { Router } from 'express';
import {
    getArticles,
    getArticleById,
    getPublicArticleDetail,
    createArticle,
    updateArticle,
    deleteArticle
} from '../controllers/article.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../../config/multer.config'; // Diperlukan untuk upload gambar

const router = Router();

// Endpoint GET bisa publik
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.get('/public/:id', getPublicArticleDetail);

// Endpoint modifikasi dilindungi
// 'upload.single('featuredImage')' akan menangani upload file sebelum controller dijalankan
router.get('/admin/:id', protect, getArticleById);
router.post('/', protect, upload.single('featuredImage'), createArticle);
router.put('/:id', protect, upload.single('featuredImage'), updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;