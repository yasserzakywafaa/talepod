import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseInit } from "./models/mongoDb";
import express from "express";
// import routes from "./routes";
import loadRoutes from "./routes";
// import googleGeminiRoutes from "./routes/googleGeminiRoutes";
// import openAIRoutes from "./routes/openaiRoutes";
import path from "path";
// import testRoutes from "./routes/testRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;
// const publicClientUrl = CONFIG.IS_DEV ? "*" : CONFIG.PROD_CLIENT_PUBLIC_URL;

// CORS configuration
expressApp.use(cors());
// if (CONFIG.IS_PROD) {
//   const corsOptions = {
//     credentials: false,
//     // origin: publicClientUrl,
//     // origin: "*",
//     origin: window.location.origin,
//     methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   };
//   expressApp.use(cors(corsOptions));
//   // Handle OPTIONS preflight requests for all routes
//   expressApp.options("*", cors());
// } else {
//   expressApp.use(cors());
// }

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// // Mount API routes dynamically
// expressApp.use("/api", routes);

// Load and mount API routes
loadRoutes(expressApp);

// // Mount API routes
// expressApp.use(testRoutes);
// expressApp.use(googleGeminiRoutes);
// expressApp.use(openAIRoutes);

databaseInit();

if (CONFIG.IS_PROD) {
  // Serve Frontend Bundled Application
  const buildPath = path.join(__dirname, "/");
  expressApp.use(express.static(buildPath));
  // expressApp.get("*", (req, res) => {
  //   if (!req.path.startsWith("/api")) {
  //     res.sendFile(path.join(buildPath, "index.html"));
  //   }
  // });
}

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    PORT,
    ENVIRONMENT: CONFIG.NODE_ENV,
    PROD_CLIENT_PUBLIC_URL: CONFIG.PROD_CLIENT_PUBLIC_URL,
    deployPath: path.join(__dirname, "/"),
    deployClientPath: path.join(path.join(__dirname, "/"), "/index.html"),
  });
});

module.exports = expressApp;
