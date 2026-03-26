"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const api_error_1 = __importDefault(require("../utility/api.error"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const allowedMimetypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const isExtAllowed = allowedExtensions.includes(ext);
    const isMimeAllowed = allowedMimetypes.includes(file.mimetype);
    if (isExtAllowed && isMimeAllowed) {
        return cb(null, true);
    }
    else {
        cb(new api_error_1.default('Only .png, .jpg, .jpeg and .pdf formats are allowed!', 400));
    }
};
exports.kycUpload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
}).fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]);
