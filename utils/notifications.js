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
exports.scheduleNotifications = scheduleNotifications;
exports.cancelJobs = cancelJobs;
const node_schedule_1 = require("node-schedule");
const sendSMS_1 = __importDefault(require("./sendSMS")); // Import without the file extension
const jobs = {}; // Track scheduled jobs for each task
function scheduleNotifications(jobData) {
    const { taskID, task, deadline, receiver, dateArr } = jobData;
    jobs[taskID] = [];
    dateArr.forEach((date, i) => {
        const msgBody = `Reminder ${i + 1} to finish your task: "${task}" by ${deadline.toString()}.`;
        const job = (0, node_schedule_1.scheduleJob)(date, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = { body: msgBody, to: receiver };
                yield (0, sendSMS_1.default)(msg);
            }
            catch (error) {
                console.log(error);
            }
        }));
        jobs[taskID].push(job);
    });
}
function cancelJobs(taskID) {
    var _a;
    (_a = jobs[taskID]) === null || _a === void 0 ? void 0 : _a.forEach(job => job.cancel());
}
