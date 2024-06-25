import CONFIG from "./config";
import { Express } from "express";
import cors from "cors";

const allowedOrigins = ["https://talepod.com", "https://api.talepod.com"];

const corsOptions = {
  // origin: (origin: string, callback: Function) => {
  //   const allowedOrigins = CONFIG.PROD_CLIENT_PUBLIC_URLS.split(", ");

  //   console.log("ℹ️  allowedOrigins:>>>", { allowedOrigins });

  //   if (allowedOrigins.includes(origin) || !origin) {
  //     callback(null, true);
  //   } else {
  //     console.error(`❌ Not allowed by CORS: ${origin}`);
  //     callback(new Error("❌ Not allowed by CORS"));
  //   }
  // },
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const handleCorsConfig = (expressApp: Express) => {
  if (CONFIG.IS_DEV) {
    expressApp.use(cors());
  } else {
    expressApp.use(cors(corsOptions));
    // Explicitly handle OPTIONS requests
    expressApp.options("*", cors(corsOptions));
  }
};

export default handleCorsConfig;
