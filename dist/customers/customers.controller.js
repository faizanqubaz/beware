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
const auth_utility_1 = require("../utility/auth.utility");
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
    // get the senderemail and enduser email
    const inviteTo = req.query.inviteTo;
    const inviteFrom = req.query.inviteFrom;
    // check if empty
    if (!inviteTo || !inviteFrom) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid or missing invite parameters!',
        });
    }
    try {
        // get the management api
        const managementToken = yield (0, auth_utility_1.getManagementToken)();
        const UserExists = yield (0, auth_utility_1.getUserFromManagementToken)(managementToken, inviteTo);
        // if user not exists
        if (UserExists.length == 0) {
            const state = JSON.stringify({ inviteTo, inviteFrom });
            const authUrl = `https://${process.env.AUTH0_SPA_DOMAIN}/authorize?` +
                qs_1.default.stringify({
                    client_id: process.env.AUTH0_SPA_DOMAIN,
                    response_type: 'code',
                    redirect_uri: process.env.AUTH0_SPA_REDIRECT_URI,
                    scope: 'openid profile email read:users',
                    audience: `https://${process.env.AUTH0_SPA_DOMAIN}/api/v2/`,
                    state,
                });
            console.log('authurl', authUrl);
            return res.redirect(authUrl);
        }
        //IF USER EXIST
        const existingCustomer = yield customer_model_1.Customer.findOne({
            email: UserExists[0].email,
        });
        if (existingCustomer) {
            return res.redirect(`http://localhost:3000?email=${existingCustomer.email}&name=${existingCustomer.name}`);
        }
        const newCustomer = customer_model_1.Customer.build({
            name: UserExists[0].name,
            email: UserExists[0].email,
            created_at: UserExists[0].created_at,
            username: UserExists[0].nickname,
            picture: UserExists[0].picture,
            userId: UserExists[0].userId,
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
// IF THE USER NOT EXIT IN AUTH0 THEN IT WILL CALLED
const getAuthorizationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const state = req.query.state;
    if (!code || !state) {
        return res.status(400).json({
            status: 400,
            message: 'Authorization code or state is missing!',
        });
    }
    const { inviteTo, inviteFrom } = JSON.parse(state);
    const managementToken = yield (0, auth_utility_1.getManagementToken)();
    const UserFromManagementToken = yield (0, auth_utility_1.getUserFromManagementToken)(managementToken, inviteTo);
    const auth0User = UserFromManagementToken[0];
    // // SAVE THAT INTO THE CUSTOMER TABLE ALSO
    const newCustomerAdded = customer_model_1.Customer.build({
        name: auth0User.name,
        email: auth0User.email,
        created_at: auth0User.created_at,
        username: auth0User.nickname,
        userId: auth0User.user_id,
        picture: auth0User.picture,
        inviteFrom: inviteFrom,
    });
    yield newCustomerAdded.save();
    return res.redirect(`http://localhost:3000?email=${UserFromManagementToken[0].email}&name=${UserFromManagementToken[0].name}`);
});
exports.getAuthorizationCode = getAuthorizationCode;
