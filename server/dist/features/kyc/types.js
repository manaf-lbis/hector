"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycStatus = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["AADHAR"] = "aadhar";
    DocumentType["PAN"] = "pan";
    DocumentType["VOTERS_ID"] = "voters_id";
    DocumentType["DRIVING_LICENSE"] = "driving_license";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "pending";
    KycStatus["APPROVED"] = "approved";
    KycStatus["REJECTED"] = "rejected";
    KycStatus["RESUBMITTED"] = "resubmitted";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
