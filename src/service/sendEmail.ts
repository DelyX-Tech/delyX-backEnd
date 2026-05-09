import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export const sendEmail = async (mailOptions: Mail.Options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 10000,
        });

        const info = await transporter.sendMail({
            from: `"DelyX" <${process.env.EMAIL}>`,
            ...mailOptions,
        });

        console.log("Message sent:", info.messageId);
        return info;

    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export const GeneratOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
};