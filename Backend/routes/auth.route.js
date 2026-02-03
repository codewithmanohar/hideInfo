import express from "express";
import { signInController, SignUpController } from "../controllers/auth.controller.js";


const route = express.Router(); 

route.post("/sign-in" , signInController);
route.post("/sign-up" , SignUpController);

export default route ; 