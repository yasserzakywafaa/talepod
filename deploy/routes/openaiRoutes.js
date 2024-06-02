"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const endpoints_1 = tslib_1.__importDefault(require("../models/endpoints"));
const OpenAIController_1 = tslib_1.__importDefault(require("../controllers/OpenAIController"));
const express_1 = tslib_1.__importDefault(require("express"));
// import END_POINTS from 'server/src/models/endpoints'
const openAIRouter = express_1.default.Router();
// Define API routes
openAIRouter.post(endpoints_1.default.OPENAI.GENERATE.TEXT, OpenAIController_1.default.generateText);
openAIRouter.post(endpoints_1.default.OPENAI.GENERATE.TEXT_TO_SPEECH, OpenAIController_1.default.generateTextToSpeech);
openAIRouter.post(endpoints_1.default.OPENAI.GENERATE.IMAGES, OpenAIController_1.default.generateImages);
exports.default = openAIRouter;
//# sourceMappingURL=openaiRoutes.js.map