import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../config/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/file', authenticate, upload.single('file'), uploadFile);

export default router;
