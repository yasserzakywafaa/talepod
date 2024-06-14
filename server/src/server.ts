import CONFIG from "./config";
import bodyParser from "body-parser";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import handleCorsConfig from "./cors-config";
import loadRoutes from "./routes";
import path from "path";

const expressApp = express();
const buildPath = path.join(__dirname, "../client/");
// const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.STAG_PORT;

const getPort = (): string => {
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

if (CONFIG.SERVE_STATIC_CONTENT === "true") {
  // Load API routes dynamically
  loadRoutes(expressApp);

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
    // res.send("👋🏻  HELLO 'GET' Request 🙋🏻‍♂️ ");
  });
} else {
  // Load API routes dynamically
  loadRoutes(expressApp);
}

// Initiate MongoDB connection
databaseInit();

expressApp.listen(PORT, (): void => {
  console.log("☁️  Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
  });
});

module.exports = expressApp;
