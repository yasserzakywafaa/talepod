import ContactController from "../controllers/ContactController";
import CONFIG from "../config";
import END_POINTS from "../models/endpoints";
import { Router } from "express";
import { createContactGuard } from "../middleware/contactGuard";
import { database } from "../models/mongoDb";

const contactRouter = Router();

// Turnstile + honeypot + rate limits run before anything is emailed.
contactRouter.post(
  END_POINTS.CONTACT.SUPPORT,
  createContactGuard({
    getDb: () => database,
    secretKey: CONFIG.TURNSTILE_SECRET_KEY,
    isProd: CONFIG.IS_PROD,
    isLocal: CONFIG.IS_LOCAL,
    max: CONFIG.CONTACT_RATE_LIMIT_MAX,
    windowMs: CONFIG.CONTACT_RATE_LIMIT_WINDOW_MS,
  }),
  ContactController.contactSupport
);

export default contactRouter;
