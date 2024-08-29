import { Request, Response } from "express";
import TaskModel from "../models/Task";
import { getReminders } from "../utils/helpers";
import { cancelJobs, scheduleNotifications } from "../utils/notifications";

interface User {
    id: string;
    phone: string;
}


interface JobData {
    taskID: string;
    task: string;
    deadline: Date;
    receiver: string;
    dateArr: Date[];
}


function isUser(payload: any): payload is User {
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
async function addTaskController(req: Request, res: Response): Promise<Response> {
    try {
        let { task, deadline }: { task: string; deadline: string } = req.body;
        const reminders = getReminders(deadline);
        const deadlineDate = new Date(deadline);

        if (!req.user || !isUser(req.user)) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const { id: user, phone }: User = req.user;

        const taskDoc = new TaskModel({ user, task, deadline: deadlineDate, reminders });
        await taskDoc.save();

        const jobData: JobData = {
            taskID: (taskDoc._id as unknown as string), // Ensure _id is a string
            task,
            deadline: deadlineDate,
            receiver: phone,
            dateArr: reminders
        };        
        scheduleNotifications(jobData);

        return res.status(200).json({ message: "Task Added Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
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
async function editTaskController(req: Request, res: Response): Promise<Response> {
    try {
        const taskID = req.params.taskid;

        if (!req.user || !isUser(req.user)) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const { id }: User = req.user;

        const task = await TaskModel.findOne({ _id: taskID, user: id });

        if (!task) {
            return res.status(404).json({ message: "Task Not Found!" });
        }

        let { task: updatedTask, deadline, status }: { task: string; deadline: string; status: boolean } = req.body;
        const reminders = getReminders(deadline);
        const deadlineDate = new Date(deadline);

        await TaskModel.updateOne(
            { _id: taskID },
            { $set: { task: updatedTask, status, deadline: deadlineDate, reminders } }
        );
        cancelJobs(taskID);

        if (!status) {
            const { phone }: User = req.user;
            const jobData: JobData = {
                taskID: taskID,
                task: updatedTask,
                deadline: deadlineDate,
                receiver: phone,
                dateArr: reminders
            };
            scheduleNotifications(jobData);
        }
        return res.status(200).json({ message: "Task Updated Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/delete/:taskid
    @method : DELETE
    @description :
        * Extracts taskid from the route param, and creates a delete query.
        * If deletedCount is 0, sends a 404(Not Found) response.
        * Otherwise if the doc is deleted, sends a 200 (OK) response.
*/
async function deleteTaskController(req: Request, res: Response): Promise<Response> {
    try {
        const taskID = req.params.taskid;
        const { id }: User = req.user as unknown as User;
        const result = await TaskModel.deleteOne({ _id: taskID, user: id });
        const deleteCount = result.deletedCount;

        // For invalid taskid, deleteCount is 0
        if (!deleteCount) {
            return res.status(404).json({ message: "Task Not Found." });
        }
        return res.status(200).json({ message: "Task Deleted Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/:taskid
    @method : GET
    @description :
        * For an invalid taskid, sends a 404 (Not Found) response.
        * Otherwise, sends the relevant JSON document with 200 status code.
*/
async function getTaskController(req: Request, res: Response): Promise<Response> {
    try {
        if (!req.user || !isUser(req.user)) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const { id }: User = req.user;
        const taskDoc = await TaskModel.findOne({ _id: req.params.taskid, user: id }, '-__v -_id -user');

        if (!taskDoc) {
            return res.status(404).json({ message: "Task Not Found!" });
        }
        return res.status(200).json(taskDoc);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/all
    @method : GET
    @description :
        * If no tasks are available for the user, sends a 404 (Not Found) response.
        * Otherwise, sends an array of Task documents with 200 status code.
*/
async function getAllTasksController(req: Request, res: Response): Promise<Response> {
    try {
        const { id }: User = req.user as unknown as User;
        const tasks = await TaskModel.find({ user: id }, '-__v -_id -user');

        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

export { addTaskController, editTaskController, deleteTaskController, getTaskController, getAllTasksController };
