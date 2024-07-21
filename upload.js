import multer from 'multer';
import path from 'path';

// Set up multer storage and file filter
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

export default upload;
