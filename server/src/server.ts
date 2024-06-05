import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import loadRoutes from "./routes";
import path from "path";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;

// CORS configuration
expressApp.use(cors());

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// Middleware to handle API requests
expressApp.use("/api", (req, res, next) => {
  // Load API routes dynamically
  loadRoutes(expressApp);
  next();
});

// Initiate MongoDB connection
databaseInit();

if (CONFIG.IS_PROD) {
  // // Load API routes dynamically
  // loadRoutes(expressApp).then(() => {
  //   console.log("Routes Resolved:>>>");

  //   // Serve Frontend Bundled Application
  //   const buildPath = path.join(__dirname, "/");
  //   expressApp.use(express.static(buildPath));

  //   // Catch-all route
  //   expressApp.get("*", (req, res) => {
  //     if (!req.path.startsWith("/api") && req.path !== "/") {
  //       // Exclude root path as well
  //       res.sendFile(path.join(buildPath, "index.html"));
  //     }
  //   });
  // });

  // Serve Frontend Bundled Application
  const buildPath = path.join(__dirname, "/");
  expressApp.use(express.static(buildPath));

  // Catch-all route
  expressApp.get("*", (req, res) => {
    if (!req.path.startsWith("/api") && req.path !== "/") {
      // Exclude root path as well
      res.sendFile(path.join(buildPath, "index.html"));
    } else {
      res.status(404).send("Not Found");
    }
  });
}

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
    deployPath: path.join(__dirname, "/"),
  });
});

module.exports = expressApp;
