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
exports.getCustomerById = exports.getAuthorizationCode = exports.getAllCustomersBySender = exports.saveTheUser = exports.SendInvite = void 0;
const customer_model_1 = require("./customer.model");
const mongoose_1 = __importDefault(require("mongoose"));
const sendemail_utils_1 = require("../utility/sendemail.utils");
const auth_utility_1 = require("../utility/auth.utility");
const qs_1 = __importDefault(require("qs"));
const ICustomerInterface_1 = require("./ICustomerInterface");
const dotenv_1 = __importDefault(require("dotenv"));
const findone_utils_1 = require("../utility/findone.utils");
dotenv_1.default.config();
const SendInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { useremail, sender, role } = req.body;
    if (!useremail ||
        !sender ||
        !sender.name ||
        !sender.email ||
        role === undefined) {
        return res.status(400).json({
            status: 400,
            message: 'email sender and role information should not be empty!',
        });
    }
    const roleName = ICustomerInterface_1.roleMapping[role];
    if (!roleName) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid role!',
        });
    }
    const emailData = {
        to: useremail,
        sender: sender,
        role: roleName,
    };
    try {
        const inviteDetails = yield (0, sendemail_utils_1.sendEmailToUser)(emailData);
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
const saveTheUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the senderemail and enduser email
    const inviteTo = req.query.inviteTo;
    const inviteFrom = req.query.inviteFrom;
    const role = req.query.role;
    // check if empty
    if (!inviteTo || !inviteFrom || role === undefined) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid or missing invite parameters!',
        });
    }
    try {
        // get the management api
        const managementToken = yield (0, auth_utility_1.getManagementToken)();
        const UserExists = yield (0, auth_utility_1.getUserFromManagementToken)(managementToken, inviteTo);
        console.log('userExists', UserExists);
        // if user not exists
        if (UserExists.length == 0) {
            const state = JSON.stringify({ inviteTo, inviteFrom, role });
            const authUrl = `https://${process.env.AUTH0_SPA_DOMAIN}/authorize?` +
                qs_1.default.stringify({
                    client_id: process.env.AUTH0_SPA_LIENT_ID,
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
        const auth0ExistingUser = UserExists[0];
        const existingCustomer = yield (0, findone_utils_1.findCustomerBYEmail)(auth0ExistingUser.email);
        if (existingCustomer) {
            return res.redirect(`http://localhost:3000`);
        }
        const newCustomer = yield (0, findone_utils_1.saveCustomer)(auth0ExistingUser, inviteFrom, role);
        // SAVE THE USER ALSO
        const existingAuth0User = yield (0, findone_utils_1.findUserByEmail)(auth0ExistingUser.email);
        if (existingAuth0User) {
            return res.redirect(`http://localhost:3000`);
        }
        yield (0, findone_utils_1.saveUserToDB)(auth0ExistingUser, role);
        return res.redirect(`http://localhost:3000`);
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
    const { inviteTo, inviteFrom, role } = JSON.parse(state);
    const managementToken = yield (0, auth_utility_1.getManagementToken)();
    const UserFromManagementToken = yield (0, auth_utility_1.getUserFromManagementToken)(managementToken, inviteTo);
    const auth0User = UserFromManagementToken[0];
    console.log('auth0User', auth0User);
    const authUserId = auth0User.user_id;
    console.log('authuserId', authUserId);
    // // SAVE THAT INTO THE CUSTOMER TABLE ALSO
    // save roles to auth0 user also
    yield (0, auth_utility_1.addRoleToUser)(managementToken, authUserId, role);
    // CHECK IF THE CUSTOMER ALREADY EXISTS
    const customerExists = yield (0, findone_utils_1.findCustomerBYEmail)(auth0User.email);
    if (customerExists) {
        return res.redirect(`http://localhost:3000?email=${customerExists.email}&name=${customerExists.name}`);
    }
    yield (0, findone_utils_1.saveCustomer)(auth0User, inviteFrom, role);
    // CHECK FOR USER EXISTS WITH THE EMAIL FIRST
    const existingUser = yield (0, findone_utils_1.findUserByEmail)(auth0User.email);
    if (existingUser) {
        return res.redirect(`http://localhost:3000?email=${existingUser.email}&name=${existingUser.name}`);
    }
    yield (0, findone_utils_1.saveUserToDB)(auth0User, role);
    return res.redirect(`http://localhost:3000?email=${UserFromManagementToken[0].email}&name=${UserFromManagementToken[0].name}`);
});
exports.getAuthorizationCode = getAuthorizationCode;
// GET CUSTOMER BY ID
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    if (!customerId) {
        return res.status(400).json({
            status: 400,
            message: 'customerIdId parameter is required!',
        });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid customerId format',
        });
    }
    try {
        const customer = yield customer_model_1.Customer.findById(customerId).exec();
        if (!customer) {
            return res.status(404).json({
                status: 404,
                message: 'No Customer found for this ID',
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'Customer found',
            data: customer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while fetching the customer',
        });
    }
});
exports.getCustomerById = getCustomerById;
