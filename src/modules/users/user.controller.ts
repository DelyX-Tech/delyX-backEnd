import { Router } from "express";
import US from "./user.service"
import { validation } from "../../middleware/validation";
import * as UV from "./user.validation";
import { Authentication } from "../../middleware/authentication";
import { TokenType } from "../../utils/token";
const userRouer = Router()
userRouer.post("/signup",validation(UV.signUpSchema),US.signUp)
userRouer.patch("/confirm",US.confirmEmail)
userRouer.post("/signin",validation(UV.signInSchema),US.signIn)
userRouer.post("/logout",Authentication(),validation(UV.logoutSchema),US.logout)
userRouer.get("/refresh",Authentication(TokenType.refresh),US.refreshToken)
userRouer.patch("/forgetPassword",validation(UV.forgetPasswordSchema),US.forgetPassword)
userRouer.patch("/resetPassword",validation(UV.resetPasswordSchema),US.resetPassword)
userRouer.delete("/freeze/:userId",Authentication(TokenType.access),validation(UV.freezeAccountSchema),US.freezeAccount)
userRouer.patch("/unfreeze/:userId",Authentication(TokenType.access),US.unfreezeAccount)
userRouer.patch("/updatePassword",Authentication(TokenType.access),US.updatePassword)
userRouer.patch("/updateEmail",Authentication(TokenType.access),US.updateEmail)

export default userRouer