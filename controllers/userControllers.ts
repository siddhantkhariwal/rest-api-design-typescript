import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import UserModel from "../models/User"; // Ensure UserModel is a TypeScript file

// Define the type for the request body
interface SignUpRequestBody {
    fname: string;
    email: string;
    password: string;
    phone: string;
}

interface LogInRequestBody {
    email: string;
    password: string;
}

// @route  : /api/user/register
// @method : POST
// @body   : { fname: , email: , password: , phone: }
// @description :
// * If the email is already in use, sends a 409 (Conflict) response.
// * In req.body, replaces the plaintext password with its hashed form.
// * Creates a new User document, and pushes it into the tasky-users collection.
async function signUpController(req: Request<{}, {}, SignUpRequestBody>, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        // Prohibit a user's double registration
        if (user) {
            return res.status(409).json({ message: "The User is already registered." });
        }

        req.body.password = await bcrypt.hash(password, 10); // Hash the password
        await new UserModel(req.body).save(); // Save the new User info in DB

        return res.status(200).json({ message: "User Registered Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. Try Again!" });
    }
}

// @route  : /api/user/login
// @method : POST
// @body   : { email: , password: }
// @description :
// * If the email or the password is invalid, then sends a 401 (Unauthorised) response.
// * For valid credentials, creates and sends a JWT.
async function logInController(req: Request<{}, {}, LogInRequestBody>, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        // Verify Email
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // JWT Payload
        const payload = {
            id: user._id,
            email: user.email,
            phone: user.phone
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

        return res.status(200).json({ message: "Logged In Successfully.", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. Try Again!" });
    }
}

export { signUpController, logInController };
