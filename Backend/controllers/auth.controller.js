import userModel from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signInController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(404).json({ message: "All fields are required" });
        };

        const user = await userModel.findOne({ email });

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(404).json({ message: "invalid creditionals" });
        };

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks 
            samesite: "script", // CSRF cross-site request forgery attacks 
            secure: process.env.NODE_ENV !== "development" // if not development then true  
        });

        res.status(201).json({
            message: "success",
        });
    } catch (error) {
        console.log(`Error in signIn : ${error.message}`);
    }
}

export const SignUpController = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !email || !last_name || !password) {
            res.staus(404).json({ message: "All fields Required" });
        };

        const check_user = await userModel.findOne({ email });

        if (check_user) res.status(401).json({ message: "User already Exits" });

        const hashPassword = await bcrypt.hash(password, 10);

        const response = await userModel.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
        });


        res.status(201).json({
            message: "User Register Successfully !",
            user_id: response._id,
        });


    } catch (error) {
        res.json(error.message);
    }
}