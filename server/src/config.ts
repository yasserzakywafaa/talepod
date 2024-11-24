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

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Hosting
  HOST_AWS_S3_BUCKET_NAME_DEV: process.env.HOST_AWS_S3_BUCKET_NAME_DEV,
  HOST_AWS_S3_BUCKET_NAME_PROD: process.env.HOST_AWS_S3_BUCKET_NAME_PROD,
  HOST_AWS_ACCESS_KEY: process.env.HOST_AWS_ACCESS_KEY,
  HOST_AWS_SECRET_KEY: process.env.HOST_AWS_SECRET_KEY,
  HOST_AWS_REGION: process.env.HOST_AWS_REGION,

  // Email Service
  SMTP: process.env.SMTP,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,

  // Analytics
  GOOGLE_ANALYTICS_MEASUREMENT_ID: process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_API_SECRET: process.env.GOOGLE_ANALYTICS_API_SECRET,
  GOOGLE_ANALYTICS_TRACKING_URL: (MEASUREMENT_ID: string, API_SECRET: string) =>
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,

  // Stripe [TEST]
  STRIPE_TEST_PUB_KEY: process.env.STRIPE_TEST_PUB_KEY,
  STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
  STRIPE_TEST_WEBHOOK_SECRET: process.env.STRIPE_TEST_WEBHOOK_SECRET,

  // Stripe [LIVE]
  STRIPE_LIVE_PUB_KEY: process.env.STRIPE_LIVE_PUB_KEY,
  STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY,
  STRIPE_LIVE_WEBHOOK_SECRET: process.env.STRIPE_LIVE_WEBHOOK_SECRET,

  // Auth
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET,

  // App Constants
  MAX_STORIES_LIMIT_FREE: 4,
  MAX_STORIES_LIMIT_PREMIUM: 50,
  MAX_STORIES_LIMIT_ADVANCED: 999,
};

export default CONFIG;
