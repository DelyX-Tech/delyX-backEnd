import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/classError";
import { confirmEmailSchemaType, flagType, forgetPasswordSchemaType, freezeAccountSchemaType, logoutSchemaType, resetPasswordSchemaType, signInSchemaType, signUpSchemaType, upDateEmailSchemaType, upDatePasswordSchemaType } from "./user.validation";
import userModdel, { ProviderType, RoleType } from "../../model/user.model";
import { UserRepository } from "../../DB/repositories/user.repository";
import { Compare, Hash } from "../../utils/hash";
import { eventEmitter } from "../../utils/event";
import { GeneratOTP } from "../../service/sendEmail";
import { GenerateToken } from "../../utils/token";
import { v4 as uuidv4 } from "uuid";
import { RevokTokenRepository } from "../../DB/repositories/revok.repository";
import RevokTokenModdel from "../../model/revok.Token";

class UserService {
    private _userModel =new UserRepository(userModdel)
    private _revokToken =new RevokTokenRepository(RevokTokenModdel)
    
    
    constructor(){}

    //========================================================================
    signUp = async(req:Request,res:Response,next:NextFunction)=>{

        let{userName, email, password, cPassword, gender, address, age, phone, role}:signUpSchemaType=req.body
        if(await this._userModel.findOne({email})){
            throw new AppError("email already exist",405)
        }
        const hash = await Hash(password)
        const otp = await GeneratOTP()
        const hashedOTP =await Hash(String(otp))
        const user=await this._userModel.creatOneUser({userName,email,otp:hashedOTP,password:hash,gender,address,age,phone, role})
        eventEmitter.emit("confirmEmail",{email,otp})
        return res.status(200).json({message:"welcom",user})
    }

    //==========================================================================
    confirmEmail = async(req:Request,res:Response,next:NextFunction)=>{
        const{email,otp}:confirmEmailSchemaType=req.body
        const user =await this._userModel.findOne({email,confirmed:{$exists:false}})
        if(!user){
            throw new AppError("email not exist or already confirmed",405)
        }
        if(!await Compare(otp,user?.otp!)){
            throw new AppError("invalid Otp",405)
        }
        await this._userModel.updateOne({email:user?.email},{confirmed:true,$unset:{otp:""}})
        return res.status(200).json({message:"confirmed.."})
    }

    //===========================================================================
    signIn=async(req:Request,res:Response,next:NextFunction)=>{
        const{email,password}:signInSchemaType=req.body
        const user =await this._userModel.findOne({email,confirmed:{$exists:true},provider:ProviderType.system})
        if(!user){
            throw new AppError("user not found or confirmed yet",405)
        }
        if(!await Compare(password,user?.password!)){
            throw new AppError("invalid password",405)
        }
        if (user.isTwoFAEnabled) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedOTP = await Hash(String(otp));
        user.loginOtp = hashedOTP;
        user.loginOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); 
        await user.save();
        eventEmitter.emit("sendEmail", { email: user.email, otp });
        return res.status(200).json({ message: "OTP sent to your email, please confirm login" });}
        //////////////////////////////////////////////////
        const jwtid = uuidv4()
        const access_token =await GenerateToken({
            payload:{id:user._id,email:user.email},
            signature:user?.role==RoleType.user?process.env.ACCESS_TOKEN_USER!:process.env.ACCESS_TOKEN_ADMIN!,
            options:{expiresIn:60*60,jwtid}})
        
        const refresh_token=await GenerateToken({
            payload:{id:user._id,email:user.email},
            signature:user?.role==RoleType.user?process.env.REFRESH_TOKEN_USER!:process.env.REFRESH_TOKEN_ADMIN!,
            options:{expiresIn:"1y",jwtid}})
        return res.status(200).json({message:"welcome",access_token,refresh_token})
    }

    //=======================================================
    logout=async(req:Request,res:Response,next:NextFunction)=>{
        const {flag}:logoutSchemaType=req.body
        if(flag===flagType.all){
            await this._userModel.updateOne({_id:req.user?._id},{changCredentials:new Date()})
            return res.status(200).json({message:"success ,log out from all devices"})
        }
        await this._revokToken.create({
            tokenId:req.decoded?.jti!,
            userId:req.user?._id!,
            expireAt:new Date(req.decoded?.exp!*1000)
        })
        return res.status(200).json({message:"success log out from this device"})
    }

    //=======================================================================
    refreshToken=async(req:Request,res:Response,next:NextFunction)=>{
        const jwtid = uuidv4()
        const access_token =await GenerateToken({
            payload:{id:req?.user?._id,email:req?.user?.email},
            signature:req?.user?.role==RoleType.user?process.env.ACCESS_TOKEN_USER!:process.env.ACCESS_TOKEN_ADMIN!,
            options:{expiresIn:60*60,jwtid}})
        
        const refresh_token=await GenerateToken({
            payload:{id:req?.user?._id,email:req?.user?.email},
            signature:req?.user?.role==RoleType.user?process.env.REFRESH_TOKEN_USER!:process.env.REFRESH_TOKEN_ADMIN!,
            options:{expiresIn:"1y",jwtid}})
            return res.status(200).json({message:"welcome",access_token,refresh_token})
        }

    //=====================================================================
    forgetPassword=async(req:Request,res:Response,next:NextFunction)=>{
        const {email}:forgetPasswordSchemaType=req.body
        const user =await this._userModel.findOne({email,confirmed:{$exists:true}})
        if(!user){
            throw new AppError("email not exist or already confirmed",405)
        }
        const otp =await GeneratOTP()
        const hashedOTP =await Hash(String(otp))    
        eventEmitter.emit("forgetPassword",{email,otp})
        await this._userModel.updateOne({email:user?.email},{otp:hashedOTP})
        return res.status(200).json({message:"success send otp"})
    }

    //======================================================================
    resetPassword=async(req:Request,res:Response,next:NextFunction)=>{
        const {email,otp,password,cPassword}:resetPasswordSchemaType=req.body
        const user =await this._userModel.findOne({email,otp:{$exists:true}})
        if(!user){
            throw new AppError("email not found",405)
        }
        if(!await Compare(otp,user?.otp!)){
            throw new AppError("invalid otp");
        }
        const hash =await Hash(password)
        await this._userModel.updateOne({email:user?.email},{password:hash,$unset:{otp:""}})
        return res.status(200).json({message:"success"})
    }

    //=====================================================================
    freezeAccount=async(req:Request,res:Response,next:NextFunction)=>{
        const{userId}:freezeAccountSchemaType=req.params as freezeAccountSchemaType
        if(userId&&req.user?.role!==RoleType.admin){
            throw new AppError("unAuthorized",405)
        }
        const user = await this._userModel.findOneAndUpdate({_id:userId||req.user?._id,deletedAt:{$exists:false}},
            {deletedAt:new Date(),deletedBy:req.user?._id,changCredentials:new Date()})
        if(!user){
            throw new AppError("user not found",405)
        }
        return res.status(200).json({message:"success"})
    }

    //=====================================================================
    unfreezeAccount=async(req:Request,res:Response,next:NextFunction)=>{
        const{userId}:freezeAccountSchemaType=req.params as freezeAccountSchemaType
        if(req.user?.role!==RoleType.admin){
            throw new AppError("unAuthorized",405)
        }
        const user = await this._userModel.findOneAndUpdate({_id:userId,deletedAt:{$exists:true}},{
            $unset:{deletedAt:"",deletedBy:""},
            restoredAt:new Date(),
            restoredBy:req.user?._id
        })
        if(!user){
            throw new AppError("user not found",405)
        }
        return res.status(200).json({message:"success"})
    }

    //=======================================================================
    updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email, newPassword }: upDatePasswordSchemaType = req.body
        const user = await this._userModel.findOne({ email })
        if (!user) {
            throw new AppError("User not found", 404)
        }
        const hashedPassword = await Hash(newPassword)
        await this._userModel.updateOne({ email},{password: hashedPassword })
            return res.status(200).json({ message: "Password updated successfully" })
    }

    //======================================================================
    updateEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { oldEmail, newEmail }:upDateEmailSchemaType = req.body
        const user = await this._userModel.findOne({ email: oldEmail })
        if (!user) {
            throw new AppError("User not found", 404)
        }
        const isTaken = await this._userModel.findOne({ email: newEmail })
        if (isTaken) {
            throw new AppError("New email is already in use", 409)
        }
        await this._userModel.updateOne(
            { email: oldEmail },
            { email: newEmail, confirmed: false }
        );
        const otp = await GeneratOTP();
        const hashedOTP = await Hash(String(otp))
        await this._userModel.updateOne(
            { email: newEmail },
            { otp: hashedOTP }
        );
        eventEmitter.emit("updateEmail", { email: newEmail, otp })
        return res.status(200).json({ message: "Email updated successfully" })
    }
}
export default new UserService()
