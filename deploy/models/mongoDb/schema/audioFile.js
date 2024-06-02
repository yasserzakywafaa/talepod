"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const audioFileSchema = new mongoose_1.default.Schema({
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const AudioFile = mongoose_1.default.model("AudioFile", audioFileSchema);
exports.default = AudioFile;
//# sourceMappingURL=audioFile.js.map