import express from "express";
import { createInfo, deleteInfo } from "../controllers/info.controller.js";
import { auth } from "../middlewares/auth.js";

const route = express.Router();

route.post("/create" ,auth , createInfo);
route.delete("/delete" , auth , deleteInfo);
export default route; 