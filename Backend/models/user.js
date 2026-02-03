import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name : {
        required : true,
        type  : String,
    }, 
    last_name : {
        type: String, 
    },
    email : {
        type : String,
        required: true, 
        unique : true
    },
    password : {
        type: String , 
        required: true,
        minlenghth : 6
    }
},
    {timestamps : true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel ; 