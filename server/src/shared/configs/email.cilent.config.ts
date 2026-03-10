import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();


console.log(process.env.EMAIL_USER,process.env.BREVO_API_KEY,process.env.EMAIL_SENDER_NAME);

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_USER!,
            name: process.env.EMAIL_SENDER_NAME || "Hector",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
    });
};