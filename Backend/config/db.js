import mongoose  from "mongoose";

export const dbConnect = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URL); 
        console.log(`Database Connected : ${res.connection.host}`);
    } catch (error) {
        console.log(`Error in db : ${error.message}`); 
    }
};