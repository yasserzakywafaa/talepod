import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import loadRoutes from "./routes";
import path from "path";
// import googleGeminiRoutes from "./routes/googleGeminiRoutes";
// import openaiRoutes from "./routes/openaiRoutes";
// import testRoutes from "./routes/testRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;

// CORS configuration
expressApp.use(cors());

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

if (CONFIG.IS_PROD) {
  // Load API routes dynamically
  loadRoutes(expressApp);

  // Serve Frontend Bundled Application
  const buildPath = path.join(__dirname, "/");
  expressApp.use(express.static(buildPath));

  // Initiate MongoDB connection
  databaseInit();

  expressApp.get("*", (req, res) => {
    console.log("<<<: Route path :>>>", {
      path: req.path,
    });

    res.sendFile(path.join(buildPath, "index.html"));
  });
}

if (CONFIG.IS_DEV) {
  // Load API routes dynamically
  loadRoutes(expressApp);

  // Initiate MongoDB connection
  databaseInit();
}

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
    deployPath: path.join(__dirname, "/"),
  });
});

module.exports = expressApp;
