import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF'), false);
  }
};

const multerConfig = {
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
};

export const uploadSingle = multer(multerConfig).single('cv');
export const uploadMultiple = multer(multerConfig).array('cvs', 50);
