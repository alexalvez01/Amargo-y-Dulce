import { Router } from "express";
import { googleLogin } from "../controllers/UserController.js";

const authRoutes = Router();

authRoutes.post("/google", googleLogin);

export default authRoutes;
