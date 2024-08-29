import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for the Task model
interface ITask extends Document {
    user: mongoose.Types.ObjectId;
    task: string;
    deadline: Date;
    status: boolean;
    reminders: Date[];
}

// Define the Task schema with TypeScript
const taskSchema: Schema<ITask> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    task: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    reminders: [Date]
});

// Create the Task model with TypeScript
const TaskModel = mongoose.model<ITask>('Task', taskSchema, 'tasks');

export default TaskModel;
