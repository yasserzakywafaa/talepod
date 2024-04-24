import CONFIG from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import googleGeminiRoutes from "./routes/googleGeminiRoutes";
import openAIRoutes from "./routes/openaiRoutes";

const expressApp = express();
const PORT = CONFIG.IS_DEV ? CONFIG.DEV_PORT : CONFIG.PROD_PORT;

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Mount API routes
expressApp.use(googleGeminiRoutes);
expressApp.use(openAIRoutes);

// // Uncomment if you need to serve the client production (build) locally.
// if (CONFIG.IS_PROD) {
//   // Serve Frontend Bundled Application
//   expressApp.use(express.static(CONFIG.FRONTEND_BUILD_PATH, { index: false }));

//   // Serve index.html by default
//   expressApp.get("/", (request, response) => {
//     response.status(200).sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
//   });

//   expressApp.get("*", (req, res) => {
//     //this serves index.html if no other URL hits
//     res.status(200).sendFile(`${CONFIG.FRONTEND_BUILD_PATH}/index.html`);
//   });
// }

expressApp.listen(PORT, () =>
  console.log("Server running on:>>>", {
    ENVIRONMENT: CONFIG.NODE_ENV,
    PORT,
  })
);

module.exports = expressApp;
