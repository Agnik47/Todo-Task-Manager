import mongoose from "mongoose";

export const conectDb = async ()=> {
    try {
        await  mongoose.connect("mongodb+srv://agnikpaul0020:hTuq5Mc%23.HD7Cf%24@practice.lg6fw6a.mongodb.net/?retryWrites=true&w=majority&appName=practice/todo-app",);
        console.log("Data Base Conected ✅");
        
    } catch (error) {
        console.log("Data Base Didn't coonectt ❌");
        
    }

}
