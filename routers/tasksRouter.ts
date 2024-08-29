import express from "express";
import { Request, Response, NextFunction } from "express";

import {
    addTaskController,
    deleteTaskController,
    editTaskController,
    getAllTasksController,
    getTaskController
} from "../controllers/tasksControllers";

import authMiddleware from "../middlewares/auth/userAuth";
import { 
    taskIdValidator, 
    addTaskValidator, 
    validationErrorHandler, 
    editTaskValidator 
} from "../middlewares/validations/validators";

const tasksRouter = express.Router();

// Router-level Auth middleware
tasksRouter.use(authMiddleware);

// Define routes with their respective handlers and validators
tasksRouter.get('/all', (req: Request, res: Response, next: NextFunction) => {
    getAllTasksController(req, res).catch(next);
});

tasksRouter.get(
    '/:taskid',
    taskIdValidator(),
    validationErrorHandler,
    (req: Request, res: Response, next: NextFunction) => {
        getTaskController(req, res).catch(next);
    }
);

tasksRouter.post(
    '/add',
    addTaskValidator(),
    validationErrorHandler,
    (req: Request, res: Response, next: NextFunction) => {
        addTaskController(req, res).catch(next);
    }
);

tasksRouter.put(
    '/edit/:taskid',
    taskIdValidator(),
    editTaskValidator(),
    validationErrorHandler,
    (req: Request, res: Response, next: NextFunction) => {
        editTaskController(req, res).catch(next);
    }
);

tasksRouter.delete(
    '/delete/:taskid',
    taskIdValidator(),
    validationErrorHandler,
    (req: Request, res: Response, next: NextFunction) => {
        deleteTaskController(req, res).catch(next);
    }
);

export default tasksRouter;
