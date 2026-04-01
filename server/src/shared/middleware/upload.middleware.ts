import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import ApiError from '../utility/api.error';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const allowedMimetypes = ['image/jpeg', 'image/png', 'application/pdf'];

    const ext = path.extname(file.originalname).toLowerCase();
    const isExtAllowed = allowedExtensions.includes(ext);
    const isMimeAllowed = allowedMimetypes.includes(file.mimetype);

    if (isExtAllowed && isMimeAllowed) {
        return cb(null, true);
    } else {
        cb(new ApiError('Only .png, .jpg, .jpeg and .pdf formats are allowed!', 400) as any);
    }
};

export const kycUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
}).fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]);

export const categoryUpload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for categories
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const allowedMimetypes = ['image/jpeg', 'image/png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext) && allowedMimetypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ApiError('Only .png, .jpg, and .jpeg formats are allowed for categories!', 400) as any);
        }
    }
}).single('image');
