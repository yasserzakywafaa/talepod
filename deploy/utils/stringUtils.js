"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioFileUrl = exports.replaceSpaceWithDash = void 0;
/**
 * Replace spaces in a string with dash
 */
const replaceSpaceWithDash = (string) => {
    return string.split(" ").join("-");
};
exports.replaceSpaceWithDash = replaceSpaceWithDash;
/**
 * Generate full audio file url
 */
const getAudioFileUrl = (protocol, host, path, fileName) => {
    return `${protocol}://${host}/${path}/${fileName}`;
};
exports.getAudioFileUrl = getAudioFileUrl;
//# sourceMappingURL=stringUtils.js.map