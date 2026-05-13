"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplate = void 0;
const emailTemplate = (otp, title) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0px; padding:0px; background-color:#0a0f1e; font-family: Arial, sans-serif;">

<table border="0" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1e; padding: 40px 0;">
<tr>
<td align="center">

<table border="0" width="560" cellpadding="0" cellspacing="0" style="background-color:#0d1529; border-radius:16px; overflow:hidden; border: 1px solid #1a2a4a;">

    <tr>
        <td align="center" style="background: linear-gradient(135deg, #0d1529 0%, #0a1a3e 100%); padding: 40px 30px 30px 30px; border-bottom: 2px solid #1e4db7;">
            <div style="font-size: 38px; font-weight: 900; letter-spacing: 3px; color: #ffffff;">
                DELY<span style="color: #2979ff;">X</span>
            </div>
            <div style="font-size: 11px; letter-spacing: 6px; color: #4d8aff; margin-top: 4px;">DELAY ZERO</div>
        </td>
    </tr>

    <tr>
        <td style="height: 4px; background: linear-gradient(90deg, #1e4db7, #2979ff, #64b5f6);"></td>
    </tr>

    <tr>
        <td align="center" style="padding: 40px 30px 10px 30px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">${title}</h1>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: #7a9cc8;">Use the code below to complete your request</p>
        </td>
    </tr>

    <tr>
        <td align="center" style="padding: 30px 30px 30px 30px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #1a2a4a, #0d1d3a); border: 2px solid #2979ff; border-radius: 12px; padding: 20px 50px;">
                <span style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #2979ff;">${otp}</span>
            </div>
            <p style="margin: 16px 0 0 0; font-size: 13px; color: #4a6a9a;">
                This code is valid for <strong style="color:#64b5f6;">10 minutes</strong>. Do not share it with anyone.
            </p>
        </td>
    </tr>

    <tr>
        <td align="center" style="background-color: #080d1a; padding: 16px 30px; border-top: 1px solid #1a2a4a;">
            <p style="margin: 0; font-size: 11px; color: #2a3a5a;">© 2025 DelyX · Delay Zero · All rights reserved</p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
};
exports.emailTemplate = emailTemplate;
