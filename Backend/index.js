import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { dbConnect } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import vaultRoutes from "./routes/vault.routes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());


app.get("/", (req, res) => res.json({ ok: true, message: "Vault API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on ${PORT}`);
});