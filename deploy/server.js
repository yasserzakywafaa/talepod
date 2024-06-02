"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("./config"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const mongoDb_1 = require("./models/mongoDb");
const express_1 = tslib_1.__importDefault(require("express"));
const googleGeminiRoutes_1 = tslib_1.__importDefault(require("./routes/googleGeminiRoutes"));
const openaiRoutes_1 = tslib_1.__importDefault(require("./routes/openaiRoutes"));
const path_1 = tslib_1.__importDefault(require("path"));
const testRoutes_1 = tslib_1.__importDefault(require("./routes/testRoutes"));
const expressApp = (0, express_1.default)();
const PORT = config_1.default.IS_DEV ? config_1.default.DEV_PORT : config_1.default.PROD_PORT;
const publicClientUrl = config_1.default.IS_DEV ? "*" : config_1.default.PROD_CLIENT_PUBLIC_URL;
// CORS configuration
if (config_1.default.IS_PROD) {
    const corsOptions = {
        credentials: false,
        // origin: publicClientUrl,
        origin: "*",
        methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    expressApp.use((0, cors_1.default)(corsOptions));
    // Handle OPTIONS preflight requests for all routes
    expressApp.options("*", (0, cors_1.default)());
}
else {
    expressApp.use((0, cors_1.default)());
}
// Middleware
expressApp.use(express_1.default.json());
expressApp.use(body_parser_1.default.json());
expressApp.use(express_1.default.urlencoded({ extended: true }));
// // Serve static files from the specified directory
// expressApp.use(
//   `/${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}`,
//   express.static(CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH)
// );
// Mount API routes
expressApp.use(testRoutes_1.default);
expressApp.use(googleGeminiRoutes_1.default);
expressApp.use(openaiRoutes_1.default);
(0, mongoDb_1.databaseInit)();
if (config_1.default.IS_PROD) {
    // Serve Frontend Bundled Application
    expressApp.use(express_1.default.static("./"));
    expressApp.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "./index.html"));
    });
    // expressApp.use((err, req, res, next) => {
    //   console.error("<<<: SERVER Production Error :>>>", err.stack);
    //   res.status(500).send("Internal Server Error");
    // });
}
expressApp.listen(PORT, () => {
    console.log("Server running on:>>>", {
        PROD_CLIENT_PUBLIC_URL: config_1.default.PROD_CLIENT_PUBLIC_URL,
        ENVIRONMENT: config_1.default.NODE_ENV,
        PORT,
    });
});
module.exports = expressApp;
//# sourceMappingURL=server.js.map