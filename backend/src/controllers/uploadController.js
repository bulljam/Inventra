import { buildUploadUrl, upload } from '../config/upload.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    res.json({
      url: buildUploadUrl(req, req.file.filename)
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed' });
  }
};
