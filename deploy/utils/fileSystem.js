"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.getAbsolutePath = exports.deleteFile = exports.saveFile = exports.deleteDirectory = exports.createDirectory = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const createDirectory = (filePath, callback) => {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.mkdir(filePath, (error) => {
            if (error)
                callback(error);
            else {
                callback(null);
                console.log(`🗂  Directory Created :> '${filePath}'`);
            }
        });
    }
    else {
        callback(null);
    }
};
exports.createDirectory = createDirectory;
const deleteDirectory = (filePath, callback) => fs_1.default.rm(filePath, { recursive: true }, callback);
exports.deleteDirectory = deleteDirectory;
const saveFile = (filePath, fileData, callback) => fs_1.default.writeFile(filePath, fileData, { flag: "w" }, callback);
exports.saveFile = saveFile;
const deleteFile = (filePath, callback) => fs_1.default.unlink(filePath, callback);
exports.deleteFile = deleteFile;
const getAbsolutePath = (relativePath) => path_1.default.resolve(`${relativePath}`);
exports.getAbsolutePath = getAbsolutePath;
const readFile = async (relativePath) => {
    return await new Promise((resolve, reject) => {
        fs_1.default.readFile(relativePath, "utf8", (error, data) => resolve(data));
    }).then((data) => data);
};
exports.readFile = readFile;
//# sourceMappingURL=fileSystem.js.map