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
exports.getAuthorizationCode = exports.getAllCustomersBySender = exports.saveTheUser = exports.SendInvite = void 0;
const customer_model_1 = require("./customer.model");
const user_model_1 = require("../users/user.model");
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SendInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { useremail, sender } = req.body;
    if (!useremail || !sender || !sender.name || !sender.email) {
        return res.status(400).json({
            status: 400,
            message: 'email and sender information should not be empty!',
        });
    }
    const emailData = {
        to: useremail,
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
exports.SendInvite = SendInvite;
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
            html: `<p>You have been invited by ${emailData.sender.name} (${emailData.sender.email}). Click the confirmation Link, kindly use this <a href="http://localhost:5000/api/v2/customer/confirmation-link?inviteFrom=${emailData.sender.email}&inviteTo=${emailData.to}">link</a> for verification.</p>`,
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
        const userExists = yield user_model_1.User.findOne({ email: inviteTo });
        if (!userExists) {
            const authUrl = `https://dev-nl5xd2r8c23rplbr.us.auth0.com/authorize?` +
                qs_1.default.stringify({
                    client_id: 'L3eoXDSx4mpLrxWxic528L3Rg2dEMopi',
                    response_type: 'code',
                    redirect_uri: '',
                    scope: 'openid profile email read:users',
                    audience: `https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/`
                });
            console.log('authurl', authUrl);
            return res.redirect(authUrl);
        }
        //IF USER EXIST SAVE THE USER TO THE CUSTOMER TABLE
        const existingCustomer = yield customer_model_1.Customer.findOne({
            email: userExists.email,
        });
        if (existingCustomer) {
            return res.redirect(`http://localhost:3000?email=${existingCustomer.email}&name=${existingCustomer.name}`);
        }
        const newCustomer = customer_model_1.Customer.build({
            name: userExists.name,
            email: userExists.email,
            created_at: new Date().toDateString(),
            username: userExists.name,
            picture: 'http',
            inviteFrom: inviteFrom,
        });
        yield newCustomer.save();
        console.log('Customer saved to database:', newCustomer);
        return res.redirect(`http://localhost:3000?email=${newCustomer.email}&name=${newCustomer.name}`);
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
const getAuthorizationCode = (req, res) => {
    const code = req.query.code;
    const token = getTokenFromCode(code);
};
exports.getAuthorizationCode = getAuthorizationCode;
const getTokenFromCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenResponse = yield axios_1.default.post(`https://dev-nl5xd2r8c23rplbr.us.auth0.com/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: 'L3eoXDSx4mpLrxWxic528L3Rg2dEMopi',
        client_secret: 'evpFmimHkoQrqwl4k7pIZ1cMIn1wTR6b12s-eod1cqYe0WcNHptbcBrzskm_dz9v',
        code: code,
        redirect_uri: 'http://localhost:5000/api/v2/customer/callback',
        scope: 'read:users'
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    const accessToken = tokenResponse.data.access_token;
    console.log('accessToken', accessToken);
    // Store the access token securely (e.g., in a session)
    return accessToken;
});
