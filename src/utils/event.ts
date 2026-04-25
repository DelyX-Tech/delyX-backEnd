import { EventEmitter } from "events";
import { GeneratOTP, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/email.temp";
import { UserRepository } from "../DB/repositories/user.repository";
import userModdel from "../model/user.model";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
    const { email, otp } = data;
    await sendEmail({
        to: email,
        subject: "ConfirmEmail",
        html: emailTemplate(otp, "Email Confirmation"),
    });
});

eventEmitter.on("forgetPassword", async (data) => {
    const { email, otp } = data;
    await sendEmail({
        to: email,
        subject: "forgetPassword",
        html: emailTemplate(otp, "forget password"),
    });
});

eventEmitter.on("UploadProfileImage", async (data) => {
    const { userId, oldKey, Key, expiresIn } = data;

    const _userModel = new UserRepository(userModdel);

    setTimeout(async () => {
        try {
            await _userModel.findOneAndUpdate(
                { _id: userId },
                { $unset: { tempProfileImage: "" } }
            );

            if (oldKey) {
                await _userModel.findOneAndUpdate(
                    { _id: userId },
                    { $set: { profileImage: "" }, $unset: { tempProfileImage: "" } }
                );
            }
        } catch (error: any) {
            console.log(error);

            if (error?.Code == "NoSuchKey") {
                if (!oldKey) {
                    await _userModel.findOneAndUpdate(
                        { _id: userId },
                        { $unset: { profileImage: "" } }
                    );
                } else {
                    await _userModel.findOneAndUpdate(
                        { _id: userId },
                        { $set: { profileImage: "" }, $unset: { tempProfileImage: "" } }
                    );
                }
            }
        }
    }, expiresIn * 1000);
});
