import {
  DBCollections,
  getDocumentByFieldFromDb,
  saveUserDataToDb,
} from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";
import { User, getInitialUserData } from "../models/types";
import jwt, { JwtPayload } from "jsonwebtoken";

import CONFIG from "../config";
import axios from "axios";

// import { getDocumentById } from "../models/mongoDb/crudOperations";

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
    const verifyResponseData: JwtPayload = verifyResponse.data;
    if (verifyResponseData.aud !== CONFIG.GOOGLE_OAUTH_CLIENT_ID) {
      response.status(401).json({ message: "❌ Unauthorized!" });
      return;
    }

    const {
      sub: userId,
      email,
      given_name: givenName,
      family_name: familyName,
      picture,
    } = verifyResponseData;
    let userInfo: User = {
      ...getInitialUserData(),
      userId,
      email,
      picture,
      name: { givenName, familyName },
    };

    try {
      // Check if the user exists
      const userDocument = await getDocumentByFieldFromDb(
        "userId",
        userId,
        DBCollections.users
      );
      if (!userDocument) {
        // If user doesn't exist, create a new user record
        userInfo = {
          ...getInitialUserData(),
          userId,
          email,
          name: { givenName, familyName },
          picture,
        };
        await saveUserDataToDb(userInfo);
      }
    } catch (error) {
      console.error("❌ Failed to save new user to DB!", {
        error,
      });
    }

    // Generate a JWT for the session
    const token = jwt.sign(userInfo, CONFIG.JWT_SECRET!, {
      expiresIn: "1h",
    });
    console.log("ℹ️  authByGoogle", { userInfo });

    response.status(200).json({ token, user: userInfo });
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
