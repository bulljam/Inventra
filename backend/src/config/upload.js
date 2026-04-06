import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = process.env.UPLOAD_PATH || 'uploads/';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const uploadOptions = {
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  },
};

export const createUpload = () => multer(uploadOptions);
export const upload = createUpload();

export const buildUploadUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/${filename}`;

export const deleteLocalFile = async (filename) => {
  if (!filename) {
    return;
  }

  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};
