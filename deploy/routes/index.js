"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const router = (0, express_1.Router)();
// Automatically import all route files
const routeFiles = fs_1.default
    .readdirSync(__dirname)
    .filter((file) => file.endsWith("Routes.ts"));
routeFiles.forEach((file) => {
    const route = require(path_1.default.join(__dirname, file)).default;
    router.use(route);
});
exports.default = router;
//# sourceMappingURL=index.js.map