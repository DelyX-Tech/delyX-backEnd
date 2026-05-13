"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratOTP = exports.sendEmail = void 0;
const resend_1 = require("resend");
const sendEmail = async (mailOptions) => {
    try {
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        const info = await resend.emails.send({
            from: "DelyX <no-reply@mydely.online>",
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });
        console.log("Message sent:", info.data?.id);
        return info;
    }
    catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const GeneratOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
};
exports.GeneratOTP = GeneratOTP;
