"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const endpoints_1 = tslib_1.__importDefault(require("../models/endpoints"));
const TestController_1 = tslib_1.__importDefault(require("../controllers/TestController"));
const express_1 = tslib_1.__importDefault(require("express"));
const testRouter = express_1.default.Router();
// Define API routes
testRouter.post(endpoints_1.default.TESTING.ROUTE_ONE, TestController_1.default.testRoutOne);
testRouter.post(endpoints_1.default.TESTING.ROUTE_TWO, TestController_1.default.testRoutTwo);
exports.default = testRouter;
//# sourceMappingURL=testRoutes.js.map