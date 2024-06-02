"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
dotenv_1.default.config();
const CONFIG = {
    DEV_PORT: process.env.DEV_PORT,
    PROD_PORT: process.env.PROD_PORT,
    NODE_ENV: process.env.NODE_ENV,
    DISABLE_HOT_RELOAD: process.env.REACT_APP_DISABLE_LIVE_RELOAD,
    IS_DEV: process.env.NODE_ENV && process.env.NODE_ENV.indexOf("development") > -1,
    IS_PROD: process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") > -1,
    FRONTEND_DEV_PATH: path_1.default.resolve("../client/public"),
    FRONTEND_BUILD_PATH: path_1.default.resolve("../client/build"),
    PROD_CLIENT_PUBLIC_URL: process.env.PROD_CLIENT_PUBLIC_URL,
    // Assets
    SERVER_TEXT_TO_SPEECH_PATH: "assets/audio/textToSpeech",
    SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH: path_1.default.resolve("./assets/audio/textToSpeech"),
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
    MONGODB_URI_DEV: process.env.MONGODB_URI_DEV,
    MONGODB_URI_PROD: process.env.MONGODB_URI_PROD,
    // Hosting
    HOST_AWS_S3_BUCKET_NAME: process.env.HOST_AWS_S3_BUCKET_NAME,
    HOST_AWS_ACCESS_KEY: process.env.HOST_AWS_ACCESS_KEY,
    HOST_AWS_SECRET_KEY: process.env.HOST_AWS_SECRET_KEY,
    HOST_AWS_REGION: process.env.HOST_AWS_REGION,
};
exports.default = CONFIG;
//# sourceMappingURL=config.js.map