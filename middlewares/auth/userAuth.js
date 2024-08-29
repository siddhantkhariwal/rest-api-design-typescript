"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define the authMiddleware function with TypeScript types
function authMiddleware(req, res, next) {
    try {
        const token = req.header('x-auth-key');
        if (!token) {
            res.status(401).json({ message: "Access Denied!" });
            return;
        }
        // Verify the token and decode the payload
        const payload = jsonwebtoken_1.default.verify(token, 'sherlock'); // Cast the payload to IPayload
        req.user = payload; // Attach user to the request object
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Access Denied!" });
    }
}
exports.default = authMiddleware;
