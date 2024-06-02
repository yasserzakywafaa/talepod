import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import googleGeminiRoutes from "./routes/googleGeminiRoutes";
import openAIRoutes from "./routes/openaiRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;
const publicClientUrl = CONFIG.IS_DEV ? "*" : CONFIG.PROD_CLIENT_PUBLIC_URL;
// ? `http://localhost:${CONFIG.DEV_PORT}`

// CORS configuration
expressApp.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", CONFIG.PROD_CLIENT_PUBLIC_URL);
  // res.header("Access-Control-Allow-Origin", publicClientUrl);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

// if (CONFIG.IS_PROD) {
//   expressApp.use(
//     cors({
//       // origin: publicClientUrl,
//       origin: CONFIG.PROD_CLIENT_PUBLIC_URL,
//       // origin: "*",
//       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//       allowedHeaders: ["Content-Type", "Authorization"],
//       preflightContinue: false,
//       optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//       credentials: false,
//     })
//   );
// } else {
//   expressApp.use(cors());
// }
// Handle OPTIONS preflight requests for all routes
expressApp.options("*", cors());

expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// Serve static files from the specified directory
expressApp.use(
  `/${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}`,
  express.static(CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH)
);

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(googleGeminiRoutes);
expressApp.use(openAIRoutes);

databaseInit();

// if (CONFIG.IS_PROD) {
//   // // Serve Frontend Bundled Application
//   // expressApp.use(express.static(CONFIG.FRONTEND_BUILD_PATH, { index: false }));
//   // // Catch-all route to serve `index.html` for all client-side routes
//   // expressApp.get("*", (req, res) => {
//   //   res.sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
//   // });
// }

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    PROD_CLIENT_PUBLIC_URL: CONFIG.PROD_CLIENT_PUBLIC_URL,
    ENVIRONMENT: CONFIG.NODE_ENV,
    PORT,
  });
});

module.exports = expressApp;
