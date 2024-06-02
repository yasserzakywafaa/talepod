"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const endpoints_1 = tslib_1.__importDefault(require("../models/endpoints"));
const GoogleGeminiController_1 = tslib_1.__importDefault(require("../controllers/GoogleGeminiController"));
const express_1 = tslib_1.__importDefault(require("express"));
const googleGeminiRouter = express_1.default.Router();
// Define API routes
googleGeminiRouter.post(endpoints_1.default.GOOGLE_GEMINI.GENERATE, GoogleGeminiController_1.default.generateAnswer);
googleGeminiRouter.post(endpoints_1.default.GOOGLE_GEMINI.CHAT, GoogleGeminiController_1.default.generateChat);
exports.default = googleGeminiRouter;
//# sourceMappingURL=googleGeminiRoutes.js.map