import mongoose from "mongoose";

const user_info = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "users", 
        required : true
    },
    portal_name : {
        type : String, 
        required : true 
    },
    user_password : {
        type : String, 
        required : true
    },
    user_email : {
        type : String, 
        required : true, 
    }
},
    { timestamps : true}
); 

const userInfoModel = mongoose.model("user-info", user_info); 

export default userInfoModel; 