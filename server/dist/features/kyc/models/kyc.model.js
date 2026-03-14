"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const kycSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"]
    },
    documentType: {
        type: String,
        enum: Object.values(types_1.DocumentType),
        required: [true, "Document type is required"]
    },
    documentNumber: {
        type: String,
        required: [true, "Document number is required"]
    },
    bankName: {
        type: String,
        required: [true, "Bank name is required"]
    },
    ifsc: {
        type: String,
        required: [true, "IFSC code is required"]
    },
    accountNo: {
        type: String,
        required: [true, "Account number is required"]
    },
    location: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    taluk: {
        type: String,
    },
    pincode: {
        type: String,
    },
    idCardFront: {
        type: String,
        required: [true, "ID card front image is required"]
    },
    idCardBack: {
        type: String,
        required: [true, "ID card back image is required"]
    },
    bankPassbook: {
        type: String,
        required: [true, "Bank passbook image is required"]
    },
    kycStatus: {
        type: String,
        enum: Object.values(types_1.KycStatus),
        default: types_1.KycStatus.PENDING
    },
    approvedOn: {
        type: Date
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
kycSchema.index({ kycStatus: 1 });
exports.KycModel = mongoose_1.default.model("Kyc", kycSchema);
