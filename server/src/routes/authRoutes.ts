import AuthController from "../controllers/AuthController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const authRouter = Router();

// Define API routes
authRouter.post(END_POINTS.AUTH.GOOGLE, AuthController.authByGoogle);
authRouter.get(END_POINTS.AUTH.USER_INFO, AuthController.getUserInfo);
authRouter.post(
  END_POINTS.AUTH.UPDATE_USER_INFO,
  AuthController.updateUserInfo
);

export default authRouter;
