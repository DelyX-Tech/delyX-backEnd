import mongoose from "mongoose";

const connectionDB=async()=>{
    console.log("DB_URL:", process.env.DB_URL)

    mongoose.connect(process.env.DB_URL as unknown as string)
    .then(()=>{
        console.log("success to connect db.........");
    }).catch((error)=>{
        console.log("fail to connect db......");
    })
}
export default connectionDB