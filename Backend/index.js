import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { dbConnect } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import infoRoutes from "./routes/info.route.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000  ;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get("/" , (req , res) => {
    res.status(200).json("API is working ....");
});

app.use("/api/auth", authRoutes)
app.use("/api/info", infoRoutes)

app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on ${PORT}`);
});