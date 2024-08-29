"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTaskController = addTaskController;
exports.editTaskController = editTaskController;
exports.deleteTaskController = deleteTaskController;
exports.getTaskController = getTaskController;
exports.getAllTasksController = getAllTasksController;
const Task_1 = __importDefault(require("../models/Task"));
const helpers_1 = require("../utils/helpers");
const notifications_1 = require("../utils/notifications");
function isUser(payload) {
    return payload && typeof payload.id === 'string' && typeof payload.phone === 'string';
}
/*
    @route : /api/tasks/add
    @method : POST
    @body : { task: string, deadline: string }
    @description :
        * For an invalid deadline, sends a 400 (Bad Req) response.
        * Otherwise, creates a new Task document and pushes it in the tasks collection.
*/
function addTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { task, deadline } = req.body;
            const reminders = (0, helpers_1.getReminders)(deadline);
            const deadlineDate = new Date(deadline);
            if (!req.user || !isUser(req.user)) {
                return res.status(401).json({ message: "Unauthorized!" });
            }
            const { id: user, phone } = req.user;
            const taskDoc = new Task_1.default({ user, task, deadline: deadlineDate, reminders });
            yield taskDoc.save();
            const jobData = {
                taskID: taskDoc._id, // Ensure _id is a string
                task,
                deadline: deadlineDate,
                receiver: phone,
                dateArr: reminders
            };
            (0, notifications_1.scheduleNotifications)(jobData);
            return res.status(200).json({ message: "Task Added Successfully." });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error. Try Again!" });
        }
    });
}
/*
    @route : /api/tasks/edit/:taskid
    @method : PUT
    @body : { task: string, status: boolean, deadline: string }
    @description :
        * For an invalid deadline, sends a 400 (Bad Req) response.
        * If the taskid is NA in the DB, sends a 404 (Not Found) response.
        * Otherwise, updates the relevant Task document.
*/
function editTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const taskID = req.params.taskid;
            if (!req.user || !isUser(req.user)) {
                return res.status(401).json({ message: "Unauthorized!" });
            }
            const { id } = req.user;
            const task = yield Task_1.default.findOne({ _id: taskID, user: id });
            if (!task) {
                return res.status(404).json({ message: "Task Not Found!" });
            }
            let { task: updatedTask, deadline, status } = req.body;
            const reminders = (0, helpers_1.getReminders)(deadline);
            const deadlineDate = new Date(deadline);
            yield Task_1.default.updateOne({ _id: taskID }, { $set: { task: updatedTask, status, deadline: deadlineDate, reminders } });
            (0, notifications_1.cancelJobs)(taskID);
            if (!status) {
                const { phone } = req.user;
                const jobData = {
                    taskID: taskID,
                    task: updatedTask,
                    deadline: deadlineDate,
                    receiver: phone,
                    dateArr: reminders
                };
                (0, notifications_1.scheduleNotifications)(jobData);
            }
            return res.status(200).json({ message: "Task Updated Successfully." });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error. Try Again!" });
        }
    });
}
/*
    @route : /api/tasks/delete/:taskid
    @method : DELETE
    @description :
        * Extracts taskid from the route param, and creates a delete query.
        * If deletedCount is 0, sends a 404(Not Found) response.
        * Otherwise if the doc is deleted, sends a 200 (OK) response.
*/
function deleteTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const taskID = req.params.taskid;
            const { id } = req.user;
            const result = yield Task_1.default.deleteOne({ _id: taskID, user: id });
            const deleteCount = result.deletedCount;
            // For invalid taskid, deleteCount is 0
            if (!deleteCount) {
                return res.status(404).json({ message: "Task Not Found." });
            }
            return res.status(200).json({ message: "Task Deleted Successfully." });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error. Try Again!" });
        }
    });
}
/*
    @route : /api/tasks/:taskid
    @method : GET
    @description :
        * For an invalid taskid, sends a 404 (Not Found) response.
        * Otherwise, sends the relevant JSON document with 200 status code.
*/
function getTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user || !isUser(req.user)) {
                return res.status(401).json({ message: "Unauthorized!" });
            }
            const { id } = req.user;
            const taskDoc = yield Task_1.default.findOne({ _id: req.params.taskid, user: id }, '-__v -_id -user');
            if (!taskDoc) {
                return res.status(404).json({ message: "Task Not Found!" });
            }
            return res.status(200).json(taskDoc);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error. Try Again!" });
        }
    });
}
/*
    @route : /api/tasks/all
    @method : GET
    @description :
        * If no tasks are available for the user, sends a 404 (Not Found) response.
        * Otherwise, sends an array of Task documents with 200 status code.
*/
function getAllTasksController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.user;
            const tasks = yield Task_1.default.find({ user: id }, '-__v -_id -user');
            return res.status(200).json(tasks);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error. Try Again!" });
        }
    });
}
