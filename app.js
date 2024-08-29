"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Third-party Packages
const express_1 = __importDefault(require("express"));
// DB Connection file
require("./utils/dbConnect.js");
// Routers
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const tasksRouter_1 = __importDefault(require("./routers/tasksRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// JSON Body Parser
app.use(express_1.default.json());
app.use('/api/user', userRouter_1.default);
app.use('/api/tasks', tasksRouter_1.default);
// Handles req at unavailable endpoints
app.all('*', (req, res) => {
    return res.status(404).json({ message: 'API not found!' });
});
app.listen(port, () => {
    console.log(`Server running at ${port}.`);
});
