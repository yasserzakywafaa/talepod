import CONFIG from "./config";
import authRoutes from "./routes/authRoutes";
import blogsRoutes from "./routes/blogsRoutes";
import bodyParser from "body-parser";
import contactRoutes from "./routes/contactRoutes";
import { databaseInit } from "./models/mongoDb";
import express from "express";
import handleCorsConfig from "./cors-config";
import { handleCreateBlogBulk } from "./services/create/blog";
import openaiRoutes from "./routes/openaiRoutes";
import path from "path";
import paymentWebhooksRouter from "./routes/paymentsWebhooksRoutes";
import paymentsRoutes from "./routes/paymentsRoutes";
import storiesRoutes from "./routes/storiesRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();
const buildPath = path.join(__dirname, "../client/");

const getPort = (): string => {
  // If process.env.PORT is set, use it.
  if (process.env.PORT) return process.env.PORT;

  switch (true) {
    case CONFIG.IS_DEV:
      return CONFIG.DEV_PORT;
    case CONFIG.IS_PROD:
      return CONFIG.PROD_PORT;
    default:
      return "8000";
  }
};
const PORT = getPort();

// CORS configuration
handleCorsConfig(expressApp);

// Place here because Stripe gateway need the request raw body
// which is manipulated but the "express.json()" middleware
expressApp.use(paymentWebhooksRouter);

// Middleware
expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(express.urlencoded({ extended: true }));

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(storiesRoutes);
expressApp.use(openaiRoutes);
expressApp.use(contactRoutes);
expressApp.use(authRoutes);
expressApp.use(paymentsRoutes);
expressApp.use(blogsRoutes);

const startServer = async () => {
  try {
    // Await MongoDB database connection initialization
    await databaseInit();

    // // // TEST
    // // await handleCreateBlogBulk();

    expressApp.listen(PORT, (): void => {
      console.log("🎯 Server running on:>>>", {
        PORT,
        ENVIRONMENT: CONFIG.NODE_ENV,
      });
    });
  } catch (error) {
    console.error("❌  Server Error!", error);
  }
};

startServer(); // Call the async function to start the server

module.exports = expressApp;
