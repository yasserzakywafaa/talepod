"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChat = exports.generateAnswer = void 0;
const tslib_1 = require("tslib");
// node --version # Should be >= 18
const generative_ai_1 = require("@google/generative-ai");
const googleGeminiModel_1 = require("../models/googleGeminiModel");
const config_1 = tslib_1.__importDefault(require("../config"));
// Generative API
const genAI = new generative_ai_1.GoogleGenerativeAI((_a = config_1.default.GOOGLE_GEMINI_API_KEY_1) !== null && _a !== void 0 ? _a : "");
const genAiModel = genAI.getGenerativeModel(googleGeminiModel_1.requestParams);
const generateAnswer = async (request, response, next) => {
    const userPrompt = request.body.userPrompt;
    try {
        const generateRequest = await genAiModel.generateContent(userPrompt);
        const generateResponseText = generateRequest.response.text();
        console.log("GoogleGeminiController:>>> GENERATE", {
            request,
            response: generateResponseText,
            MODEL_NAME: config_1.default.GOOGLE_GEMINI_MODEL_NAME,
        });
        response.json(generateResponseText);
    }
    catch (error) {
        console.error("GoogleGeminiController:>>> GENERATE Error", {
            error,
        });
        next(error);
    }
};
exports.generateAnswer = generateAnswer;
// Chat API
const generateChat = async (request, response, next) => {
    var _a, _b;
    // Chat Session with the model
    new generative_ai_1.ChatSession((_a = config_1.default.GOOGLE_GEMINI_API_KEY_1) !== null && _a !== void 0 ? _a : "", (_b = config_1.default.GOOGLE_GEMINI_MODEL_NAME) !== null && _b !== void 0 ? _b : "", {
        history: [],
        generationConfig: googleGeminiModel_1.generationConfig,
        safetySettings: googleGeminiModel_1.safetySettings,
    });
    const chat = genAiModel.startChat();
    const userPrompt = request.body.userPrompt;
    try {
        const chatResponse = await chat.sendMessage(userPrompt);
        const chatResponseText = chatResponse.response.text();
        console.log("GoogleGeminiController:>>> CHAT", {
            request,
            response: chatResponse.response,
            MODEL_NAME: config_1.default.GOOGLE_GEMINI_MODEL_NAME,
        });
        next(chatResponseText);
    }
    catch (error) {
        console.error("GoogleGeminiController:>>> CHAT Error", {
            error,
        });
        next(error);
    }
};
exports.generateChat = generateChat;
const GoogleGeminiController = {
    generateAnswer: exports.generateAnswer,
    generateChat: exports.generateChat,
};
exports.default = GoogleGeminiController;
//# sourceMappingURL=GoogleGeminiController.js.map