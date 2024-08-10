import AuthController from "../controllers/AuthController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const authRouter = Router();

// Define API routes
authRouter.post(END_POINTS.AUTH.GOOGLE, AuthController.authByGoogle);

export default authRouter;
