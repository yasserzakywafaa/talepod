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

expressApp.use(bodyParser.json());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Serve static files from the specified directory
expressApp.use(
  `/${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}`,
  express.static(CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH)
);

// CORS configuration
const corsOptions = {
  origin: "CONFIG.PROD_CLIENT_PUBLIC_URL",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
expressApp.use(cors(corsOptions));

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(googleGeminiRoutes);
expressApp.use(openAIRoutes);

databaseInit();

if (CONFIG.IS_PROD) {
  // expressApp.get("/", (request, response) => {
  //   response.send(`Hello World! ${CONFIG.NODE_ENV}`);
  // });
  // // Serve Frontend Bundled Application
  // expressApp.use(express.static(CONFIG.FRONTEND_BUILD_PATH, { index: false }));
  // // Catch-all route to serve `index.html` for all client-side routes
  // expressApp.get("*", (req, res) => {
  //   res.sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
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
