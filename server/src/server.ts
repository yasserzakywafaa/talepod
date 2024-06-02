import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import googleGeminiRoutes from "./routes/googleGeminiRoutes";
import openAIRoutes from "./routes/openaiRoutes";
import path from "path";
import testRoutes from "./routes/testRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;
const publicClientUrl = CONFIG.IS_DEV ? "*" : CONFIG.PROD_CLIENT_PUBLIC_URL;

// CORS configuration
if (CONFIG.IS_PROD) {
  const corsOptions = {
    credentials: false,
    // origin: publicClientUrl,
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  expressApp.use(cors(corsOptions));
  // Handle OPTIONS preflight requests for all routes
  expressApp.options("*", cors());
} else {
  expressApp.use(cors());
}

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// // Serve static files from the specified directory
// expressApp.use(
//   `/${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}`,
//   express.static(CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH)
// );

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(googleGeminiRoutes);
expressApp.use(openAIRoutes);

databaseInit();

if (CONFIG.IS_PROD) {
  // Serve Frontend Bundled Application
  expressApp.use(express.static("./"));
  expressApp.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
  });

  // expressApp.use((err, req, res, next) => {
  //   console.error("<<<: SERVER Production Error :>>>", err.stack);
  //   res.status(500).send("Internal Server Error");
  // });
}

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    PROD_CLIENT_PUBLIC_URL: CONFIG.PROD_CLIENT_PUBLIC_URL,
    ENVIRONMENT: CONFIG.NODE_ENV,
    PORT,
  });
});

module.exports = expressApp;
