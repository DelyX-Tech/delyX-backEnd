import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (mailOptions: {
    to: string | string[];
    subject: string;
    html: string;
}) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,

            auth: {
                user: process.env.EMAIL!,
                pass: process.env.EMAIL_PASSWORD!,
            },

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,

        } as SMTPTransport.Options);

        await transporter.verify();

        console.log("SMTP connected");

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