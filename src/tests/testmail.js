import nodemailer from "nodemailer";
import dotenv from "dotenv"; dotenv.config();

// require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function test() {
    try {
        await transporter.verify();

        console.log("✅ Gmail SMTP connection successful");

        const info = await transporter.sendMail({
            from: `"My E-commerce Store" <${process.env.EMAIL_FROM}>`,
            to: "sumitdhonde0@gmail.com",
            subject: "Gmail SMTP Test",
            text: "Gmail SMTP is working successfully!",
            html: `
        <h2>Gmail SMTP Test</h2>
        <p>Gmail SMTP is working successfully!</p>
      `,
        });

        console.log("✅ Email sent successfully");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Email failed");
        console.error(error);
    }
}
// for (let i = 0; i <= 400; i++)
test();