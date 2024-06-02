"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImages = exports.generateTextToSpeech = exports.generateText = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("../config"));
const openaiModel_1 = require("../models/openaiModel");
const openai_1 = tslib_1.__importDefault(require("openai"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const mongoDb_1 = require("../models/mongoDb");
const amazonS3_1 = require("../models/amazonS3");
const openai = new openai_1.default();
const generateText = async (request, response, next) => {
    const userPrompt = request.body.userPrompt;
    // OpenAI Text Generation API Call
    try {
        const generateRequest = await openai.chat.completions.create({
            messages: [{ role: "user", content: userPrompt }],
            model: config_1.default.OPENAI_MODEL_NAME,
            temperature: 0,
            // max_tokens: 1000,
        });
        console.log("OpenAIController:>>> GENERATE TEXT", {
            request,
            response: generateRequest,
            MODEL_NAME: config_1.default.OPENAI_MODEL_NAME,
        });
        response.json(generateRequest.choices[0].message.content);
    }
    catch (error) {
        console.log("OpenAIController:>>> GENERATE TEXT Error", {
            error,
        });
        next(error);
    }
};
exports.generateText = generateText;
const generateTextToSpeech = async (request, response, next) => {
    const { userPrompt, fileName } = request.body;
    const { SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, SERVER_TEXT_TO_SPEECH_PATH, OPENAI_TTS_MODEL_NAME, } = config_1.default;
    // OpenAI Text-to-Speech Generation API Call
    try {
        const generateRequest = await openai.audio.speech.create({
            speed: 1.0,
            voice: "nova",
            input: userPrompt,
            response_format: "mp3",
            model: config_1.default.OPENAI_TTS_MODEL_NAME,
        });
        const audioFileName = `${fileName}.mp3`;
        const filePath = `${config_1.default.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
        const buffer = Buffer.from(await generateRequest.arrayBuffer());
        !fs_1.default.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
            fs_1.default.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
                recursive: true,
            });
        await fs_1.default.promises.writeFile(filePath, buffer);
        // Upload file to Amazon S3
        const fileUrl = await (0, amazonS3_1.uploadFileToS3)(fileName, filePath);
        if (fileUrl) {
            // Save file to MongoDB Atlas
            await (0, mongoDb_1.saveFileDataToDb)(audioFileName, fileUrl);
        }
        else {
            throw new Error("Failed to upload file to S3");
        }
        console.log("OpenAIController:>>> GENERATE TEXT TO SPEECH", {
            fileUrl,
            writePath: filePath,
            serverFilesPath: SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
            MODEL_NAME: OPENAI_TTS_MODEL_NAME,
        });
        response.json({
            fileUrl,
            fileName,
        });
    }
    catch (error) {
        console.log("OpenAIController:>>> GENERATE TEXT TO SPEECH Error", {
            error,
        });
        next(error);
    }
};
exports.generateTextToSpeech = generateTextToSpeech;
const generateImages = async (request, response, next) => {
    // const userPrompt = request.body.userPrompt;
    const { userPrompt, numImages } = request.body;
    // OpenAI Image Generation API Call
    try {
        const imageUrls = [];
        // Make multiple requests to generate each image
        for (let i = 0; i < numImages; i++) {
            const imageRequest = await openai.images.generate({
                n: 1, // Generate one image per request
                model: config_1.default.OPENAI_IMAGES_MODEL_NAME,
                size: openaiModel_1.IMAGES_SIZES["1024x1024"],
                response_format: "url",
                prompt: userPrompt,
                style: "natural",
                quality: "hd",
                // user: ""
            });
            // Extract the URL of the generated image from the response and add it to the array
            const imageUrl = imageRequest.data[0].url;
            imageUrls.push(imageUrl);
        }
        console.log("OpenAIController:>>> GENERATE IMAGES", {
            request,
            // response: imageRequest,
            response: imageUrls,
            MODEL_NAME: config_1.default.OPENAI_IMAGES_MODEL_NAME,
        });
        // response.json(imageRequest.data[0].url);
        response.json(imageUrls);
    }
    catch (error) {
        console.log("OpenAIController:>>> GENERATE IMAGES Error", {
            error,
        });
        next(error);
    }
};
exports.generateImages = generateImages;
const OpenAIController = {
    generateText: exports.generateText,
    generateTextToSpeech: exports.generateTextToSpeech,
    generateImages: exports.generateImages,
};
exports.default = OpenAIController;
//# sourceMappingURL=OpenAIController.js.map