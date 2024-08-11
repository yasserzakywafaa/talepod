import {
  DBCollections,
  getDocumentByFieldFromDb,
  getDocumentFromDb,
  saveUserDataToDb,
} from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";
import { User, getInitialUserData } from "../models/types";
import jwt, { JwtPayload } from "jsonwebtoken";

import CONFIG from "../config";
import axios from "axios";

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
    let user: User = {
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
        await saveUserDataToDb(user);
      } else {
        user = userDocument as User;
      }
    } catch (error) {
      console.error("❌ Failed to save new user to DB!", { error });
    }

    // Generate a JWT for the session
    const token = jwt.sign(user, CONFIG.JWT_SECRET!, {
      expiresIn: "1h",
    });
    console.log("ℹ️  authByGoogle", {
      userName: `${user.name.givenName} ${user.name.familyName}`,
      userEmail: user.email,
    });

    response.status(200).json({ token, user });
  } catch (error) {
    console.error("❌ Failed to authenticate with Google!", {
      error,
    });
    next(error);
  }
};

export const getUserInfo = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.query.userId as string;
  if (!userId) {
    response.status(400).json({ message: "❌ 'userId' is required!" });
    return;
  }

  try {
    const userDocument = (await getDocumentByFieldFromDb(
      "userId",
      userId,
      DBCollections.users
    )) as User;
    console.log("ℹ️  getUserInfo", {
      userEmail: userDocument.email,
      userName: userDocument.name.givenName,
    });

    response.status(200).json(userDocument);
  } catch (error) {
    response
      .status(500)
      .json({ message: "❌ Failed to get user information!" });
  }
};

const AuthController = {
  authByGoogle,
  getUserInfo,
};

export default AuthController;
