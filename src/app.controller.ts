import { config } from "dotenv"
import path from "path"
import { resolve } from "path"
import express, {  NextFunction, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import {rateLimit} from "express-rate-limit"
import { AppError } from "./utils/classError"
import userRouer from "./modules/users/user.controller"
import connectionDB from "./DB/connectionDB"
import deviceRouter from "./modules/device/device.controller"
import orderRouter from "./modules/oreders/order.controller"

config({path:resolve("./config/.env")})
config()
const app :express.Application=express()
const port:string|number =process.env.PORT||5000

const limiter = rateLimit({
    windowMs:5*60*1000,
    limit:10,
    message:{
        error:"game over........"
    },
    statusCode:429,
    legacyHeaders:false
})


const bootStrap = async()=>{
    app.use(express.json())
    app.use(cors({
        // origin: process.env.CLIENT_URL,  
        // credentials: true
    }))   
    app.use(helmet())
    app.use(limiter)
    app.use("/users",userRouer)
    app.use("/device",deviceRouter)
    app.use("/orders",orderRouter)

    await connectionDB()


    // app.use("*",(req:Request,res:Response,next:NextFunction)=>{
    //     throw new AppError(`invalid url ${req.originalUrl}`,404)
    // })
    app.get("/", (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: "DelyX Backend is running 🚀"
        });
    });
        app.use((req: Request, res: Response) => {
        throw new AppError(`invalid url ${req.originalUrl}`, 404);
    });
    app.use((err: AppError,req:Request,res:Response,next:NextFunction)=>{
        return res.status(err.statusCode as unknown as number||500).json({message:err.message,stack:err.stack})
    })

    const httpServer=app.listen(port,()=>{
        console.log(`server is running on port ${port}!`);
    })
}

export default bootStrap
