"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("./config"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const mongoDb_1 = require("./models/mongoDb");
const express_1 = tslib_1.__importDefault(require("express"));
// import googleGeminiRoutes from "./routes/googleGeminiRoutes";
// import openAIRoutes from "./routes/openaiRoutes";
const path_1 = tslib_1.__importDefault(require("path"));
const routes_1 = tslib_1.__importDefault(require("./routes"));
// import testRoutes from "./routes/testRoutes";
const expressApp = (0, express_1.default)();
const PORT = config_1.default.IS_DEV ? config_1.default.DEV_PORT : config_1.default.PROD_PORT;
// const publicClientUrl = CONFIG.IS_DEV ? "*" : CONFIG.PROD_CLIENT_PUBLIC_URL;
// CORS configuration
expressApp.use((0, cors_1.default)());
// if (CONFIG.IS_PROD) {
//   const corsOptions = {
//     credentials: false,
//     // origin: publicClientUrl,
//     // origin: "*",
//     origin: window.location.origin,
//     methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   };
//   expressApp.use(cors(corsOptions));
//   // Handle OPTIONS preflight requests for all routes
//   expressApp.options("*", cors());
// } else {
//   expressApp.use(cors());
// }
// Middleware
expressApp.use(express_1.default.json());
expressApp.use(body_parser_1.default.json());
expressApp.use(express_1.default.urlencoded({ extended: true }));
// Mount API routes dynamically
expressApp.use("/api", routes_1.default);
(0, mongoDb_1.databaseInit)();
const buildPath = path_1.default.join(__dirname, "/");
if (config_1.default.IS_PROD) {
    // Serve Frontend Bundled Application
    // const buildPath = path.join(__dirname, "/");
    expressApp.use(express_1.default.static(buildPath));
    expressApp.get("*", (req, res) => {
        res.sendFile(path_1.default.join(buildPath, "/index.html"));
    });
}
expressApp.listen(PORT, () => {
    console.log("Server running on:>>>", {
        PROD_CLIENT_PUBLIC_URL: config_1.default.PROD_CLIENT_PUBLIC_URL,
        ENVIRONMENT: config_1.default.NODE_ENV,
        PORT,
        buildPath,
        buildPathResponse: path_1.default.join(buildPath, "/index.html"),
    });
});
module.exports = expressApp;
//# sourceMappingURL=server.js.map