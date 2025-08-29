// src/api/routes/testimonial.routes.ts
import { Router } from 'express';
import { upload } from '../../config/multer.config';
import { protect } from '../middleware/auth.middleware';
import { 
    getTestimonials, 
    deleteTestimonial, 
    updateTestimonialFeaturedStatus,
    createTestimonial 
} from '../controllers/testimonial.controller';

const router = Router();

// GET bisa publik
router.get('/', getTestimonials);

router.post('/', upload.single('avatar'), createTestimonial);


// Modifikasi harus dilindungi
router.post('/', protect, createTestimonial);
router.delete('/:id', protect, deleteTestimonial);
router.patch('/:id/featured', protect, updateTestimonialFeaturedStatus);

export default router;