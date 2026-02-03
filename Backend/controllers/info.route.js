import express from "express"
import userInfoModel from "../models/user_info";

export const createInfo = async (req , res) => {
    try {
        const { portal_name, user_email, user_password } = req.body;

        if(!portal_name || !user_email || !user_password ){
            return res.status(404).json({message : "all fields are required "}); 
        }; 

        const response = await userInfoModel.create({
            portal_name, 
            user_email, 
            user_password
        }); 

        return res.status(201).json({
            message : "success",
            response
        });

    } catch (error) {
       console.log(`Error in createInfo : ${error.message}`);
    }
}