import nodemailer from "nodemailer";
import { EmailProvider } from "./EmailProvider.js";

export class SmtpProvider extends EmailProvider {
    constructor() {
        super();

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail({ to, subject, html, text }) {
        return this.transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME || 'My Store'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
    }
}
