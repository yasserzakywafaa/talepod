"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = void 0;
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const fs_1 = tslib_1.__importDefault(require("fs"));
// Hosting
aws_sdk_1.default.config.update({
    accessKeyId: config_1.default.HOST_AWS_ACCESS_KEY,
    secretAccessKey: config_1.default.HOST_AWS_SECRET_KEY,
    region: config_1.default.HOST_AWS_REGION,
});
const amazonS3 = new aws_sdk_1.default.S3();
const uploadFileToS3 = async (fileName, filePath) => {
    // Upload Audio file to AWS S3
    const fileContent = fs_1.default.readFileSync(filePath);
    const params = {
        Body: fileContent,
        Bucket: config_1.default.HOST_AWS_S3_BUCKET_NAME,
        Key: `${config_1.default.SERVER_TEXT_TO_SPEECH_PATH}/${fileName}`,
        ContentType: "audio/mp3",
    };
    try {
        const response = await amazonS3.upload(params).promise();
        console.log("amazonS3 model:>>> File uploaded successfully", {
            response,
        });
        return response.Location;
    }
    catch (error) {
        if (error) {
            console.error("amazonS3 model:>>> ERROR", {
                err: error,
            });
            throw error;
        }
    }
    return "";
};
exports.uploadFileToS3 = uploadFileToS3;
//# sourceMappingURL=index.js.map