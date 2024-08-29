import twilio from "twilio";

// Fetch environment variables
const {
    TWILIO_SID: sid,
    TWILIO_AUTH: auth,
    TWILIO_NO: myNo
} = process.env;

// Initialize Twilio client
const client = twilio(sid as string, auth as string);

// Define types for the message object
interface SMSMessage {
    body: string;
    to: string;
}

async function sendSMS(msg: SMSMessage): Promise<void> {
    try {
        const { body, to } = msg;
        const res = await client.messages.create({
            body,
            to,
            from: myNo
        });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

export default sendSMS;
