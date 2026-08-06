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
  END_POINTS.AUTH.GOOGLE_MOBILE_EXCHANGE,
  AuthController.googleMobileExchange,
);

authRouter.get(END_POINTS.AUTH.APPLE, AuthController.oauth2Apple);

// Apple form-posts the callback whenever name/email scopes are requested; the
// GET registration covers the no-scope case.
authRouter.post(
  END_POINTS.AUTH.APPLE_CALLBACK,
  AuthController.oauth2AppleCallback,
);

authRouter.get(
  END_POINTS.AUTH.APPLE_CALLBACK,
  AuthController.oauth2AppleCallback,
);

authRouter.post(
  END_POINTS.AUTH.APPLE_MOBILE_EXCHANGE,
  AuthController.appleMobileExchange,
);

authRouter.post(
  END_POINTS.AUTH.APPLE_NATIVE_EXCHANGE,
  AuthController.appleNativeExchange,
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
authRouter.delete(
  END_POINTS.AUTH.DELETE_ACCOUNT,
  authMiddleware,
  AuthController.deleteAccount,
);

export default authRouter;
