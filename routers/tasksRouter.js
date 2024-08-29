"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasksControllers_1 = require("../controllers/tasksControllers");
const userAuth_1 = __importDefault(require("../middlewares/auth/userAuth"));
const validators_1 = require("../middlewares/validations/validators");
const tasksRouter = express_1.default.Router();
// Router-level Auth middleware
tasksRouter.use(userAuth_1.default);
// Define routes with their respective handlers and validators
tasksRouter.get('/all', (req, res, next) => {
    (0, tasksControllers_1.getAllTasksController)(req, res).catch(next);
});
tasksRouter.get('/:taskid', (0, validators_1.taskIdValidator)(), validators_1.validationErrorHandler, (req, res, next) => {
    (0, tasksControllers_1.getTaskController)(req, res).catch(next);
});
tasksRouter.post('/add', (0, validators_1.addTaskValidator)(), validators_1.validationErrorHandler, (req, res, next) => {
    (0, tasksControllers_1.addTaskController)(req, res).catch(next);
});
tasksRouter.put('/edit/:taskid', (0, validators_1.taskIdValidator)(), (0, validators_1.editTaskValidator)(), validators_1.validationErrorHandler, (req, res, next) => {
    (0, tasksControllers_1.editTaskController)(req, res).catch(next);
});
tasksRouter.delete('/delete/:taskid', (0, validators_1.taskIdValidator)(), validators_1.validationErrorHandler, (req, res, next) => {
    (0, tasksControllers_1.deleteTaskController)(req, res).catch(next);
});
exports.default = tasksRouter;
