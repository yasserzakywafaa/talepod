import dotenv from "dotenv";
import path from "path";

dotenv.config();

const CONFIG = {
  DEV_PORT: process.env.DEV_PORT,
  STAG_PORT: process.env.STAG_PORT,
  PROD_PORT: process.env.PROD_PORT,

  // Environment
  NODE_ENV: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV === "development",
  IS_STAG: process.env.NODE_ENV === "staging",
  IS_PROD: process.env.NODE_ENV === "production",

  // Public URLs
  PUBLIC_URLS_SERVER_DEV: process.env.PUBLIC_URLS_SERVER_DEV,
  PUBLIC_URLS_SERVER_PROD: process.env.PUBLIC_URLS_SERVER_PROD,
  PUBLIC_URLS_CLIENT_DEV: process.env.PUBLIC_URLS_CLIENT_DEV,
  PUBLIC_URLS_CLIENT_PROD: process.env.PUBLIC_URLS_CLIENT_PROD,

  // Paths
  FRONTEND_DEV_PATH: path.resolve("../client/public"),
  FRONTEND_BUILD_PATH: path.resolve("../client/build"),
  SERVE_STATIC_CONTENT: process.env.SERVE_STATIC_CONTENT,
  // Assets
  SERVER_TEXT_TO_SPEECH_PATH: "assets/audio",
  SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH: path.resolve("./assets/audio"),

  // APIs keys for AI
  // Openai
  OPENAI_MODEL_NAME: process.env.OPENAI_MODEL_NAME,
  OPENAI_TTS_MODEL_NAME: process.env.OPENAI_TTS_MODEL_NAME,
  OPENAI_IMAGES_MODEL_NAME: process.env.OPENAI_IMAGES_MODEL_NAME,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // GoogleGemini
  GOOGLE_GEMINI_MODEL_NAME: process.env.GOOGLE_GEMINI_MODEL_NAME,
  GOOGLE_GEMINI_API_KEY_1: process.env.GOOGLE_GEMINI_API_KEY_1,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Hosting
  HOST_AWS_S3_BUCKET_NAME_DEV: process.env.HOST_AWS_S3_BUCKET_NAME_DEV,
  HOST_AWS_S3_BUCKET_NAME_PROD: process.env.HOST_AWS_S3_BUCKET_NAME_PROD,
  HOST_AWS_ACCESS_KEY: process.env.HOST_AWS_ACCESS_KEY,
  HOST_AWS_SECRET_KEY: process.env.HOST_AWS_SECRET_KEY,
  HOST_AWS_REGION: process.env.HOST_AWS_REGION,
};

export default CONFIG;
