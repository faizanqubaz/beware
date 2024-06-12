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
exports.getAllCustomersBySender = exports.saveTheUser = exports.SendMail = void 0;
const customer_model_1 = require("./customer.model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_config_1 = require("../utility/auth-config");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, sender } = req.body;
    if (!email || !sender || !sender.name || !sender.email) {
        return res.status(400).json({
            status: 400,
            message: 'email and sender information should not be empty!',
        });
    }
    const emailData = {
        to: email,
        sender: sender,
    };
    try {
        const inviteDetails = yield sendEmailToUser(emailData);
        res.status(200).json({
            status: 200,
            message: 'Email sent successfully',
            inviteDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: `Error sending email: ${error}`,
        });
    }
});
exports.SendMail = SendMail;
const sendEmailToUser = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    const staticSubject = 'Confirmation Link';
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailData = {
            from: process.env.SENDER_EMAIL,
            to: emailData.to,
            subject: staticSubject,
            html: `<p>You have been invited by ${emailData.sender.name} (${emailData.sender.email}). Click the confirmation Link, kindly use this <a href="http://localhost:3000/api/v2/customer/confirmation-link?inviteFrom=${emailData.sender.email}&inviteTo=${emailData.to}">link</a> for verification.</p>`,
        };
        const data = yield transporter.sendMail(mailData);
        return data;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
const saveTheUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inviteTo = req.query.inviteTo;
    const inviteFrom = req.query.inviteFrom;
    if (!inviteTo || !inviteFrom) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid or missing invite parameters!',
        });
    }
    try {
        const accessToken = yield (0, auth_config_1.getAccessToken)();
        const response = yield axios_1.default.get(`https://dev-42td93pl.us.auth0.com/api/v2/users-by-email`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                email: inviteTo,
            },
        });
        const userExists = response.data;
        if (!Array.isArray(userExists) || userExists.length === 0) {
            return res.json({
                status: 200,
                message: 'user doesnot exists in Auth0 please signup!!',
            });
        }
        // SAVE THE USER TO THE DATABSE
        const firstUser = userExists[0];
        const existingCustomer = yield customer_model_1.Customer.findOne({ email: firstUser.email });
        if (existingCustomer) {
            return res.status(200).json({
                status: 200,
                message: 'Customer Already Exist in the DB',
            });
        }
        const newCustomer = customer_model_1.Customer.build({
            name: firstUser.name,
            email: firstUser.email,
            created_at: firstUser.created_at,
            username: firstUser.name,
            picture: firstUser.picture,
            inviteFrom: inviteFrom,
        });
        yield newCustomer.save();
        console.log('Customer saved to database:', newCustomer);
        res.json({
            status: 200,
            message: 'Customer authenticated and saved to database',
        });
    }
    catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
});
exports.saveTheUser = saveTheUser;
const getAllCustomersBySender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: senderEmail } = req.query;
    if (!senderEmail) {
        return res.status(400).json({
            status: 400,
            message: 'senderEmail query parameter is required!',
        });
    }
    try {
        const customers = yield customer_model_1.Customer.find({ inviteFrom: senderEmail });
        if (customers.length === 0) {
            return res.status(200).json({
                status: 200,
                message: 'No customers found for this sender',
            });
        }
        res.status(200).json({
            status: 200,
            data: customers,
        });
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching customers',
        });
    }
});
exports.getAllCustomersBySender = getAllCustomersBySender;
