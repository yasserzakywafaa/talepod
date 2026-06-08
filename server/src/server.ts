import { closeDatabase, databaseInit } from "./models/mongoDb";
import express, { NextFunction, Request, Response } from "express";

import CONFIG from "./config";
import authRoutes from "./routes/authRoutes";
import avatarRoutes from "./routes/avatarRoutes";
import blogsRoutes from "./routes/blogsRoutes";
import compression from "compression";
import contactRoutes from "./routes/contactRoutes";
import cookieParser from "cookie-parser";
import createRoutes from "./routes/createRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import handleCorsConfig from "./cors-config";
import helmet from "helmet";
import paymentWebhooksRouter from "./routes/paymentsWebhooksRoutes";
import paymentsRoutes from "./routes/paymentsRoutes";
import rateLimit from "express-rate-limit";
import { initializePassport } from "./services/passportService";
import storiesRoutes from "./routes/storiesRoutes";
import testRoutes from "./routes/testRoutes";

const expressApp = express();

const getPort = (): string | undefined => {
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

handleCorsConfig(expressApp);

expressApp.use(paymentWebhooksRouter);

expressApp.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", CONFIG.APP_URL],
      },
    },
  }),
);
expressApp.disable("x-powered-by");

expressApp.use(express.json({ limit: "5mb" }));
expressApp.use(cookieParser());
expressApp.use(
  compression({
    filter: (req: Request, res: Response) => {
      if (req.path.includes("/blog-stream")) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);
expressApp.use(express.urlencoded({ extended: true, limit: "5mb" }));
expressApp.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});
expressApp.use(limiter);

initializePassport();

expressApp.use(testRoutes);
expressApp.use(storiesRoutes);
expressApp.use(createRoutes);
expressApp.use(contactRoutes);
expressApp.use(authRoutes);
expressApp.use(avatarRoutes);
expressApp.use(paymentsRoutes);
expressApp.use(blogsRoutes);
expressApp.use(dashboardRoutes);

expressApp.use((req: Request, res: Response) => {
  res.status(404).json({ error: "🙁 Endpoint not found" });
});

expressApp.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`❌ [${new Date().toISOString()}] Error: ${err.stack}`);
    res.status(500).json({
      error: CONFIG.IS_PROD ? "❌ Internal server error" : err.message,
      stack: CONFIG.IS_DEV ? err.stack : undefined,
    });
  },
);

const startServer = async () => {
  try {
    await databaseInit();

    const server = expressApp.listen(PORT, (): void => {
      console.log("🎯 Server running on:>>>", {
        PORT,
        ENVIRONMENT: CONFIG.NODE_ENV,
      });
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(async () => {
        await closeDatabase();
        console.log("🚪 HTTP server closed!");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("🤓  Server Error!", error);
  }
};

startServer();

module.exports = expressApp;
