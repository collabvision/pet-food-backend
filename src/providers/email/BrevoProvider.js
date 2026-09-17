import nodemailer from "nodemailer";
import { EmailProvider } from "./EmailProvider.js";

export class BrevoProvider extends EmailProvider {
    constructor() {
        super();

        this.transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST,
            port: Number(process.env.BREVO_SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASSWORD
            }
        });
    }

    async sendEmail({ to, subject, html, text }) {
        return this.transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to,
            subject,
            text,
            html
        });
    }
}