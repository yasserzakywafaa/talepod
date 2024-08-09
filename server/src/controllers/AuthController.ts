import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import axios from "axios";
import jwt from "jsonwebtoken";

export const authByGoogle = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { idToken } = request.body;

  if (!idToken) {
    response.status(400).json({ message: "❌ 'idToken' is required!" });
    return;
  }

  try {
    // Verify the ID token with Google
    const verifyResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    if (verifyResponse.data.aud !== CONFIG.GOOGLE_OAUTH_CLIENT_ID) {
      response.status(401).json({ message: "❌ Unauthorized!" });
      return;
    }

    const { sub, email, name, picture } = verifyResponse.data;

    // Here, you would typically check if the user exists in your database
    // If not, create a new user record
    // For simplicity, we'll just generate a JWT for the session

    const userPayload = { id: sub, email, name, picture };

    const token = jwt.sign(userPayload, CONFIG.JWT_SECRET!, {
      expiresIn: "1h",
    });

    console.log("ℹ️  authByGoogle", {
      response: {
        userPayload,
        token,
      },
    });

    response.status(200).json({
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error("❌ Failed to authenticate with Google!", {
      error,
    });
    next(error);
  }
};

const AuthController = {
  authByGoogle,
};

export default AuthController;
