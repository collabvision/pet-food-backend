import nodemailer from "nodemailer";
import { EmailProvider } from "./EmailProvider.js";

export class OutlookProvider extends EmailProvider {
    constructor() {
        super();

        this.transporter = nodemailer.createTransport({
            host: process.env.OUTLOOK_SMTP_HOST,
            port: Number(process.env.OUTLOOK_SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD
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

    async verifyConnection() {
        await this.transporter.verify();
        return true;
    }
}