"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });
        await transporter.verify();
        console.log("SMTP connected");
        const info = await transporter.sendMail({
            from: `"DelyX" <${process.env.EMAIL}>`,
            ...mailOptions,
        });
        console.log("Message sent:", info.messageId);
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
