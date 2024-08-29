import { scheduleJob, Job } from "node-schedule";
import sendSMS from "./sendSMS"; // Import without the file extension

interface JobData {
    taskID: string;
    task: string;
    deadline: Date;
    receiver: string;
    dateArr: Date[];
}

const jobs: { [key: string]: Job[] } = {}; // Track scheduled jobs for each task

function scheduleNotifications(jobData: JobData): void {
    const { taskID, task, deadline, receiver, dateArr } = jobData;
    jobs[taskID] = [];

    dateArr.forEach((date, i) => {
        const msgBody = `Reminder ${i + 1} to finish your task: "${task}" by ${deadline.toString()}.`;
        const job = scheduleJob(date, async () => {
            try {
                const msg = { body: msgBody, to: receiver };
                await sendSMS(msg);
            } catch (error) {
                console.log(error);
            }
        });
        jobs[taskID].push(job);
    });
}

function cancelJobs(taskID: string): void {
    jobs[taskID]?.forEach(job => job.cancel());
}

export { scheduleNotifications, cancelJobs };
