"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutTwo = exports.testRoutOne = void 0;
const testRoutOne = async (request, response, next) => {
    const userPrompt = request.body.userPrompt;
    try {
        const request = {
            response: {
                data: "Testing Route ONE was successfully triggered!",
            },
        };
        console.log("TestController:>>> testRoutOne", {
            request,
            userPrompt,
            response: request.response.data,
        });
        response.json(request.response.data);
    }
    catch (error) {
        console.error("TestController:>>> testRoutOne Error", {
            error,
        });
        next(error);
    }
};
exports.testRoutOne = testRoutOne;
const testRoutTwo = async (request, response, next) => {
    const userPrompt = request.body.userPrompt;
    try {
        const request = {
            response: {
                data: "Testing Route TWO was successfully triggered!",
            },
        };
        console.log("TestController:>>> testRoutTwo", {
            request,
            userPrompt,
            response: request.response.data,
        });
        response.json(request.response.data);
    }
    catch (error) {
        console.error("TestController:>>> testRoutTwo Error", {
            error,
        });
        next(error);
    }
};
exports.testRoutTwo = testRoutTwo;
const GoogleGeminiController = {
    testRoutOne: exports.testRoutOne,
    testRoutTwo: exports.testRoutTwo,
};
exports.default = GoogleGeminiController;
//# sourceMappingURL=TestController.js.map