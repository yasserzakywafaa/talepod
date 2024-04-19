import path from "path";
import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  PROD_SERVER_PORT: 8080,
  DEV_SERVER_PORT: 4001,
  NODE_ENV: process.env.NODE_ENV,
  DISABLE_HOT_RELOAD: process.env.REACT_APP_DISABLE_LIVE_RELOAD,
  IS_DEV:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("development") > -1,
  IS_PROD:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") > -1,
  FRONTEND_DEV_PATH: path.resolve(__dirname + "/../public"),
  FRONTEND_BUILD_PATH: path.resolve(__dirname + "/../build"),

  // APIs keys for AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GEMINI_API_KEY_1: process.env.GEMINI_API_KEY_1,
  GEMINI_MODEL_NAME: process.env.GEMINI_MODEL_NAME,
};

export default CONFIG;
