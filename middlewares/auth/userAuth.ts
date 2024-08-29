import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the type for the payload that will be added to the request object
interface IPayload {
    userId: string; // Adjust according to your actual payload structure
}

// Extend the Request interface to include the `user` property
declare global {
    namespace Express {
        interface Request {
            user?: IPayload;
        }
    }
}

// Define the authMiddleware function with TypeScript types
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.header('x-auth-key');
        if (!token) {
            res.status(401).json({ message: "Access Denied!" });
            return;
        }

        // Verify the token and decode the payload
        const payload = jwt.verify(token, 'sherlock') as IPayload; // Cast the payload to IPayload
        req.user = payload; // Attach user to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Access Denied!" });
    }
}

export default authMiddleware;
