import CONFIG from "./config";
import bodyParser from "body-parser";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import handleCorsConfig from "./cors-config";
import loadRoutes from "./routes";
import path from "path";

const expressApp = express();
const buildPath = path.join(__dirname, "../client/");
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PORT;

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

expressApp.listen(PORT || 8080, (): void => {
  console.log("☁️ Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
  });
});

module.exports = expressApp;
