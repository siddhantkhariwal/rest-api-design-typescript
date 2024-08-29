import express, { Request, Response, NextFunction } from "express";
import { logInController, signUpController } from "../controllers/userControllers";
import { logInValidator, signUpValidator, validationErrorHandler } from "../middlewares/validations/validators";

// Create an instance of the router
const userRouter = express.Router();

// Define the routes with their respective handlers and validators
userRouter.post(
    '/register',
    signUpValidator(),
    validationErrorHandler,
    signUpController
);

userRouter.post(
    '/login',
    logInValidator(),
    validationErrorHandler,
    logInController
);

export default userRouter;
