import dotenv from "dotenv";
import path from "path";

dotenv.config();

const CONFIG = {
  DEV_PORT: process.env.DEV_PORT,
  PROD_PORT: process.env.PROD_PORT,
  NODE_ENV: process.env.NODE_ENV,
  DISABLE_HOT_RELOAD: process.env.REACT_APP_DISABLE_LIVE_RELOAD,
  IS_DEV:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("development") > -1,
  IS_PROD:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") > -1,
  FRONTEND_DEV_PATH: path.resolve(__dirname + "/../public"),
  FRONTEND_BUILD_PATH: path.resolve(__dirname + "/../build"),
  SERVER_GENERATED_AUDIO_FILES_PATH: path.resolve(
    "./assets/generatedTextToSpeech"
  ),

  // APIs keys for AI
  // Openai
  OPENAI_MODEL_NAME: process.env.OPENAI_MODEL_NAME,
  OPENAI_TTS_MODEL_NAME: process.env.OPENAI_TTS_MODEL_NAME,
  OPENAI_IMAGES_MODEL_NAME: process.env.OPENAI_IMAGES_MODEL_NAME,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // GoogleGemini
  GOOGLE_GEMINI_MODEL_NAME: process.env.GOOGLE_GEMINI_MODEL_NAME,
  GOOGLE_GEMINI_API_KEY_1: process.env.GOOGLE_GEMINI_API_KEY_1,
};

export default CONFIG;
