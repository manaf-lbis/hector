"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepo = void 0;
const base_repo_1 = require("../../shared/base/base.repo");
const otp_model_1 = require("./models/otp.model");
class OtpRepo extends base_repo_1.BaseRepository {
    constructor() {
        super(otp_model_1.OtpModel);
    }
}
exports.OtpRepo = OtpRepo;
