import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import googleGeminiRoutes from "./routes/googleGeminiRoutes";
import openAIRoutes from "./routes/openaiRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
// Serve static files from the specified directory
expressApp.use(
  "/assets/generatedTextToSpeech",
  express.static(CONFIG.SERVER_GENERATED_AUDIO_FILES_PATH)
);

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(googleGeminiRoutes);
expressApp.use(openAIRoutes);

if (CONFIG.IS_PROD) {
  expressApp.get("/", (request, response) => {
    response.send(`Hello World! ${CONFIG.NODE_ENV}`);
  });
  // // Uncomment if you need to serve the client production (build) locally.
  // // Serve Frontend Bundled Application
  // expressApp.use(express.static(CONFIG.FRONTEND_BUILD_PATH, { index: false }));

  // // Serve index.html by default
  // expressApp.get("/", (request, response) => {
  //   response.status(200).sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
  // });

  // expressApp.get("*", (req, res) => {
  //   //this serves index.html if no other URL hits
  //   res.status(200).sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
  // });
}

expressApp.listen(PORT, (): void => {
  console.log("Server running on:>>>", {
    ENVIRONMENT: CONFIG.NODE_ENV,
    PORT,
  });
});

module.exports = expressApp;
