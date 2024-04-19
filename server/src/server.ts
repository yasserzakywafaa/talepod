import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import CONFIG from "./config";
import END_POINTS from "./models/endpoints";
import openAIRoutes from "./routes/openaiRoutes";
import googleGeminiRoutes from "./routes/googleGeminiRoutes";

const expressApp = express();
const frontendBuildPath = CONFIG.FRONTEND_BUILD_PATH;
const envPath = CONFIG.IS_DEV ? CONFIG.DEV_ENV_PATH : CONFIG.PROD_ENV_PATH;
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_SERVER_PORT : CONFIG.PROD_SERVER_PORT;

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

if (CONFIG.IS_PROD) {
  // Serve Frontend Bundled Application
  expressApp.use(express.static(frontendBuildPath, { index: false }));

  // Serve index.html by default
  expressApp.get("/", (request, response) => {
    response.status(200).sendFile(`${frontendBuildPath}/index.html`);
  });
}

// Mount API routes
expressApp.use(END_POINTS.OPENAI.USER_PROMPT, openAIRoutes);
expressApp.use(END_POINTS.GOOGLE_GEMINI.GENERATE, googleGeminiRoutes);

console.log("CONFIG.ENV:>>>", CONFIG.NODE_ENV);
console.log("envPath:>>>", envPath);

if (CONFIG.IS_PROD) {
  expressApp.get("*", (req, res) => {
    //this serves index.html if no other URL hits
    res.status(200).sendFile(`${frontendBuildPath}/index.html`);
  });
}

expressApp.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

module.exports = expressApp;
