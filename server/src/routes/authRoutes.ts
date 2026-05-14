import AuthController from "../controllers/AuthController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.get(END_POINTS.AUTH.USER_PROFILE, AuthController.getPublicUserProfile);

authRouter.get(END_POINTS.AUTH.GOOGLE, AuthController.oauth2Google);

authRouter.get(
  END_POINTS.AUTH.GOOGLE_CALLBACK,
  AuthController.oauth2GoogleCallback,
);

authRouter.post(
  END_POINTS.AUTH.PHONE_REGISTER_SEND_OTP,
  AuthController.sendPhoneRegisterOtp,
);
authRouter.post(
  END_POINTS.AUTH.PHONE_REGISTER_VERIFY_OTP,
  AuthController.verifyPhoneRegisterOtp,
);
authRouter.post(
  END_POINTS.AUTH.PHONE_LOGIN_SEND_OTP,
  AuthController.sendPhoneLoginOtp,
);
authRouter.post(
  END_POINTS.AUTH.PHONE_LOGIN_VERIFY_OTP,
  AuthController.verifyPhoneLoginOtp,
);

authRouter.post(END_POINTS.AUTH.REFRESH_TOKEN, AuthController.refreshToken);
authRouter.post(END_POINTS.AUTH.LOGOUT, AuthController.logout);

authRouter.get(
  END_POINTS.AUTH.USER_INFO,
  authMiddleware,
  AuthController.getAuthUserInfo,
);
authRouter.post(
  END_POINTS.AUTH.UPDATE_USER_INFO,
  authMiddleware,
  AuthController.updateUserInfo,
);

export default authRouter;
