"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFileDataToDb = exports.databaseInit = void 0;
const tslib_1 = require("tslib");
const audioFile_1 = tslib_1.__importDefault(require("./schema/audioFile"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const getMongoDbUri = () => {
    switch (true) {
        case config_1.default.IS_DEV:
            return config_1.default.MONGODB_URI_DEV;
        case config_1.default.IS_PROD:
            // Uncomment when going to production
            // return CONFIG.MONGODB_URI_PROD;
            return config_1.default.MONGODB_URI_DEV;
        default:
            return "";
    }
};
const databaseInit = () => {
    mongoose_1.default.connect(getMongoDbUri());
    const database = mongoose_1.default.connection;
    database.on("error", console.error.bind(console, "· Connection Error ❌"));
    database.once("open", () => {
        console.info("· Connected to MongoDB Atlas ✅");
    });
};
exports.databaseInit = databaseInit;
const saveFileDataToDb = async (audioFileName, audioFileS3Uri) => {
    // This create a MongoDB Document with the file's metadata
    const audioFile = new audioFile_1.default({
        fileName: audioFileName,
        url: audioFileS3Uri,
    });
    // Save to MongoDb Atlas
    await audioFile.save();
};
exports.saveFileDataToDb = saveFileDataToDb;
//# sourceMappingURL=index.js.map