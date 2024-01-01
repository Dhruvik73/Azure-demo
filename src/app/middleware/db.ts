const mongoose=require("mongoose")

export const connect=async()=>{
        if(!mongoose.connection.readyState){
        await mongoose.connect('mongodb://127.0.0.1:27017/todo') 
        }
}