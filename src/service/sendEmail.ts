import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (mailOptions: {
    to: string | string[];
    subject: string;
    html: string;
}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL!,
                pass: process.env.EMAIL_PASSWORD!,
            },
        } as SMTPTransport.Options);

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