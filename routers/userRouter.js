"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const validators_1 = require("../middlewares/validations/validators");
// Create an instance of the router
const userRouter = express_1.default.Router();
// Define the routes with their respective handlers and validators
userRouter.post('/register', (0, validators_1.signUpValidator)(), validators_1.validationErrorHandler, userControllers_1.signUpController);
userRouter.post('/login', (0, validators_1.logInValidator)(), validators_1.validationErrorHandler, userControllers_1.logInController);
exports.default = userRouter;
