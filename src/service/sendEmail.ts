import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { Resend } from "resend";

export const sendEmail = async (mailOptions: {
    to: string | string[];
    subject: string;
    html: string;
}) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const info = await resend.emails.send({
            from: "DelyX <no-reply@mydely.online>",
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });

        console.log("Message sent:", info.data?.id);
        return info;

    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export const GeneratOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
};