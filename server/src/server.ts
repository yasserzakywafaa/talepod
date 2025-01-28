import { closeDatabase, databaseInit } from "./models/mongoDb";
import express, { NextFunction, Request, Response } from "express";

import CONFIG from "./config";
import { SupportedLanguages } from "./utils/languages";
import authRoutes from "./routes/authRoutes";
import { blogTopics } from "./shared/mockedData/BlogTopics";
import blogsRoutes from "./routes/blogsRoutes";
import compression from "compression";
import contactRoutes from "./routes/contactRoutes";
import handleCorsConfig from "./cors-config";
import { handleCreateBulkBlogs } from "./services/create/blog";
import helmet from "helmet";
import openaiRoutes from "./routes/openaiRoutes";
import paymentWebhooksRouter from "./routes/paymentsWebhooksRoutes";
import paymentsRoutes from "./routes/paymentsRoutes";
import rateLimit from "express-rate-limit";
import storiesRoutes from "./routes/storiesRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();

const getPort = (): string | undefined => {
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

// Security middleware
expressApp.use(helmet());
expressApp.disable("x-powered-by");

// Middleware
expressApp.use(express.json());
expressApp.use(compression());
expressApp.use(express.urlencoded({ extended: true }));
// Trusts the first proxy in the X-Forwarded-For header
expressApp.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
// Apply the rate limiter globally
expressApp.use(limiter);

// Mount API routes
expressApp.use(testRoutes);
expressApp.use(storiesRoutes);
expressApp.use(openaiRoutes);
expressApp.use(contactRoutes);
expressApp.use(authRoutes);
expressApp.use(paymentsRoutes);
expressApp.use(blogsRoutes);

// 404 Handler
expressApp.use((req: Request, res: Response) => {
  res.status(404).json({ error: "🙁 Endpoint not found" });
});

// Central error handler
expressApp.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`❌ [${new Date().toISOString()}] Error: ${err.stack}`);
    res.status(500).json({
      error: CONFIG.IS_PROD ? "❌ Internal server error" : err.message,
      stack: CONFIG.IS_DEV ? err.stack : undefined,
    });
  }
);

const startServer = async () => {
  try {
    // Await MongoDB database connection initialization
    await databaseInit();
    // // Await Agenda initialization
    // await agendaInit();

    const server = expressApp.listen(PORT, (): void => {
      console.log("🎯 Server running on:>>>", {
        PORT,
        ENVIRONMENT: CONFIG.NODE_ENV,
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(async () => {
        // Add any cleanup tasks here
        await closeDatabase();
        console.log("🚪 HTTP server closed!");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // // // Create Bulk Blogs for SEO purposes
    await handleCreateBulkBlogs([
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[0]],
      },
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[1]],
      },
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[2]],
      },
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[3]],
      },
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[4]],
      },
      {
        language: SupportedLanguages.en,
        data: [blogTopics[0].data[5]],
      },
    ]);
  } catch (error) {
    console.error("🤓  Server Error!", error);
  }
};

startServer(); // Call the async function to start the server

module.exports = expressApp;
