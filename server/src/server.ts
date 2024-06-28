import CONFIG from "./config";
import bodyParser from "body-parser";
import { databaseInit } from "./models/mongoDb";
import express from "express";
// import googleGeminiRoutes from "./routes/googleGeminiRoutes";
import handleCorsConfig from "./cors-config";
import openaiRoutes from "./routes/openaiRoutes";
import path from "path";
import storiesRoutes from "./routes/storiesRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();
const buildPath = path.join(__dirname, "../client/");

const getPort = (): string => {
  // If process.env.PORT is set, use it.
  if (process.env.PORT) return process.env.PORT;

  switch (true) {
    case CONFIG.IS_DEV:
      return CONFIG.DEV_PORT;
    case CONFIG.IS_STAG:
      return CONFIG.STAG_PORT;
    case CONFIG.IS_PROD:
      return CONFIG.PROD_PORT;
    default:
      return "8000";
  }
};
const PORT = getPort();

// CORS configuration
handleCorsConfig(expressApp);

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(storiesRoutes);
expressApp.use(openaiRoutes);
// expressApp.use(googleGeminiRoutes);

// Initiate MongoDB connection
databaseInit();

if (CONFIG.SERVE_STATIC_CONTENT === "true") {
  // // Load API routes dynamically
  // loadRoutes(expressApp);

  // Serve Frontend Bundled Application
  expressApp.use(express.static(buildPath));

  expressApp.get("*", (req, res) => {
    console.log("🎯 Route path :>>>", {
      SERVE_STATIC_CONTENT: CONFIG.SERVE_STATIC_CONTENT,
      buildPath,
      path: req.path,
      sendFile: path.join(buildPath, "index.html"),
    });

    res.sendFile(path.join(buildPath, "index.html"));
  });
}

expressApp.listen(PORT, (): void => {
  console.log("🎯 Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
  });
});

module.exports = expressApp;
