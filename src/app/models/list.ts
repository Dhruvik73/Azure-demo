import mongoose from "mongoose"
interface list{
    task:string,
    status:number,
    priority:number,
    completeratio:Number,
    workHours:Number
}
const list=new mongoose.Schema<list>({
    task:{type:String,required:true},
    status:{type:Number,required:true},
    priority:{type:Number,default:3},
    completeratio:{type:Number,default:0},
    workHours:{type:Number,default:0}
})
export default mongoose.models.list || mongoose.model<list>("list",list)