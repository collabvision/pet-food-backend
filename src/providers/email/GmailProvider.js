import nodemailer from "nodemailer";
import { EmailProvider } from "./EmailProvider.js";

export class GmailProvider extends EmailProvider {
    constructor() {
        super();

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
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