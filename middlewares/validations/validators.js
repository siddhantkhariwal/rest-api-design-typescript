"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidator = signUpValidator;
exports.logInValidator = logInValidator;
exports.addTaskValidator = addTaskValidator;
exports.editTaskValidator = editTaskValidator;
exports.taskIdValidator = taskIdValidator;
exports.validationErrorHandler = validationErrorHandler;
const express_validator_1 = require("express-validator");
// @route  : /api/user/register
function signUpValidator() {
    return [
        (0, express_validator_1.body)('fname')
            .isLength({ min: 3 }).withMessage('fname must be a string with at least 3 characters.'),
        (0, express_validator_1.body)('email')
            .isEmail().withMessage('Invalid email.'),
        (0, express_validator_1.body)('password')
            .isAlphanumeric().withMessage('password must be alphanumeric.')
            .isLength({ min: 8, max: 16 }).withMessage('password must be a string with 8 to 16 characters.'),
        (0, express_validator_1.body)('phone')
            .isMobilePhone('en-IN', { strictMode: true })
            .withMessage('The phone number must have 10 digits following +91 country code.')
    ];
}
// @route  : /api/user/login
function logInValidator() {
    return [
        (0, express_validator_1.body)('email')
            .isEmail().withMessage('Invalid email.'),
        (0, express_validator_1.body)('password')
            .notEmpty().withMessage('Enter your password.')
    ];
}
// Re-used in addTaskValidator and editTaskValidator
function taskValidator() {
    return [
        (0, express_validator_1.body)('task')
            .isLength({ min: 5 }).withMessage('task must be a string with at least 5 characters.'),
        (0, express_validator_1.body)('deadline')
            .custom((dateString) => {
            // Verify Deadline String
            if (isNaN(Date.parse(dateString))) {
                return false;
            }
            const deadline = new Date(dateString);
            const currDate = new Date();
            const diffInMs = deadline.getTime() - currDate.getTime();
            const diffInMins = diffInMs / (1000 * 60);
            const diffInDays = diffInMins / (60 * 24);
            return diffInMins > 2 && diffInDays <= 30;
        })
            .withMessage('Deadline cannot be backdated, within the next 15 mins, or beyond 30 days.')
    ];
}
// @route : /api/tasks/add
function addTaskValidator() {
    return taskValidator();
}
// @route : /api/tasks/edit/:taskid
function editTaskValidator() {
    return [
        ...taskValidator(),
        (0, express_validator_1.body)('status')
            .isBoolean().withMessage('status must be true or false.')
    ];
}
// @route : /api/tasks/edit/:taskid
function taskIdValidator() {
    return (0, express_validator_1.param)('taskid')
        .isLength({ min: 24, max: 24 }).withMessage('taskid must be a 24-character hex string.');
}
// Validation Error Middleware
function validationErrorHandler(req, res, next) {
    const reqErrors = (0, express_validator_1.validationResult)(req);
    if (!reqErrors.isEmpty()) {
        res.status(400).json({ errors: reqErrors.array() }); // Ensure this line does not return a Response type.
    }
    else {
        next(); // Continue to the next middleware
    }
}
