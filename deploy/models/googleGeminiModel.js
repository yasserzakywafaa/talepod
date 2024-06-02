"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestParams = exports.safetySettings = exports.generationConfig = void 0;
const tslib_1 = require("tslib");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = tslib_1.__importDefault(require("../config"));
exports.generationConfig = {
    topK: 1,
    topP: 1,
    temperature: 0.9,
    maxOutputTokens: 2048,
};
exports.safetySettings = [
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];
exports.requestParams = {
    model: (_a = config_1.default.GOOGLE_GEMINI_MODEL_NAME) !== null && _a !== void 0 ? _a : "",
    generationConfig: exports.generationConfig,
    safetySettings: exports.safetySettings,
};
//# sourceMappingURL=googleGeminiModel.js.map