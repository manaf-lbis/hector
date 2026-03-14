"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const brevo_1 = require("@getbrevo/brevo");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.EMAIL_USER, process.env.BREVO_API_KEY, process.env.EMAIL_SENDER_NAME);
const brevo = new brevo_1.BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});
const sendEmail = async (to, subject, html) => {
    await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_USER,
            name: process.env.EMAIL_SENDER_NAME || "Hector",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
    });
};
exports.sendEmail = sendEmail;
