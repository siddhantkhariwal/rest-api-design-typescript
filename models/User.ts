import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for the User model
interface IUser extends Document {
    fname: string;
    email: string;
    password: string;
    phone: string;
}

// Define the User schema with TypeScript
const userSchema: Schema<IUser> = new Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

// Create the User model with TypeScript
const UserModel = mongoose.model<IUser>('User', userSchema, 'tasky-users');

export default UserModel;
