import cors from "cors";
import { Express } from "express";
import CONFIG from "src/config";

const corsOptions = {
  // origin: (origin: string, callback: Function) => {
  //   const allowedOrigins = CONFIG.PROD_CLIENT_PUBLIC_URLS.split(", ");
  //   if (allowedOrigins.includes(origin) || !origin) {
  //     callback(null, true);
  //   } else {
  //     console.error(`❌ Not allowed by CORS: ${origin}`);
  //     callback(new Error("❌ Not allowed by CORS"));
  //   }
  // },
  origin:
    "http://talepod.com" ||
    "https://talepod.com" ||
    "http://api.talepod.com" ||
    "https://api.talepod.com",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const handleCorsConfig = (expressApp: Express) => {
  if (CONFIG.IS_DEV) {
    expressApp.use(cors());
  } else {
    handleCorsConfig(expressApp);

    expressApp.use(cors(corsOptions));
    // Explicitly handle OPTIONS requests
    expressApp.options("*", cors(corsOptions));
  }
};

export default handleCorsConfig;
