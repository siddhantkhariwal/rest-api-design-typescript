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
exports.signUpController = signUpController;
exports.logInController = logInController;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Ensure UserModel is a TypeScript file
// @route  : /api/user/register
// @method : POST
// @body   : { fname: , email: , password: , phone: }
// @description :
// * If the email is already in use, sends a 409 (Conflict) response.
// * In req.body, replaces the plaintext password with its hashed form.
// * Creates a new User document, and pushes it into the tasky-users collection.
function signUpController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield User_1.default.findOne({ email });
            // Prohibit a user's double registration
            if (user) {
                return res.status(409).json({ message: "The User is already registered." });
            }
            req.body.password = yield bcrypt_1.default.hash(password, 10); // Hash the password
            yield new User_1.default(req.body).save(); // Save the new User info in DB
            return res.status(200).json({ message: "User Registered Successfully." });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error. Try Again!" });
        }
    });
}
// @route  : /api/user/login
// @method : POST
// @body   : { email: , password: }
// @description :
// * If the email or the password is invalid, then sends a 401 (Unauthorised) response.
// * For valid credentials, creates and sends a JWT.
function logInController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield User_1.default.findOne({ email });
            // Verify Email
            if (!user) {
                return res.status(401).json({ message: "Invalid Credentials!" });
            }
            // Verify Password
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid Credentials!" });
            }
            // JWT Payload
            const payload = {
                id: user._id,
                email: user.email,
                phone: user.phone
            };
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
            return res.status(200).json({ message: "Logged In Successfully.", token });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error. Try Again!" });
        }
    });
}
