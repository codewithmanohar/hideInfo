import express from "express"
import userInfoModel from "../models/user_info.js";

export const createInfo = async (req , res) => {
    try {
        const { portal_name, user_email, user_password } = req.body;
        const userId = req.user.id ; 

        if(!portal_name || !user_email || !user_password ){
            return res.status(404).json({message : "all fields are required "}); 
        }; 

        const response = await userInfoModel.create({
            portal_name, 
            user_email, 
            user_password, 
            userId
        }); 

        return res.status(201).json({
            message : "success",
            response
        });

    } catch (error) {
        console.log(`Error in createInfo : ${error.message}`);
        return res.status(404).json({message : error.message});
    }
}



export const deleteInfo = async (req , res) => {
    try {
        const {infoId} = req.params ; 

        const infodelete = await userInfoModel.findByIdAndDelete(infoId);

        if(infodelete) 
           return res.status(200).json({message : "success"});

        return res.status(404).json({message : "something went wrong"});

    } catch (error) {
        console.log(`Error in deleteInfo : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}



