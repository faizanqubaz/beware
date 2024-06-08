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
exports.saveTheUser = exports.SendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_config_1 = require("../utility/auth-config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Missing email');
    }
    const emailData = {
        to: email
    };
    //   const user = User.build({ name, username, password });
    try {
        yield sendEmailToUser(emailData);
        res.status(200).send('Email sent successfully');
    }
    catch (error) {
        res.status(500).send(`Error sending email: ${error}`);
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
                pass: process.env.EMAIL_PASS
            }
        });
        const mailData = {
            from: 'faizanquba1@gmail.gmail.com', // sender address
            to: emailData.to, // list of receivers
            subject: staticSubject,
            html: '<p>You requested for click the confirmation Link, kindly use this <a href="http://localhost:3000/api/v2/user/confirmation-link?token=' + emailData.to + '">link</a> for verfication</p>'
        };
        const data = yield transporter.sendMail(mailData);
        console.log('Email sent successfully', data);
        return data;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
const saveTheUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.token;
    // CHECK TO SEE IF USER IS AUTHENTICATED FROM EMAIL
    try {
        const accessToken = yield (0, auth_config_1.getAccessToken)();
        console.log('accessToken', accessToken);
        // const response = await axios.get(
        //   `https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //     params: {
        //       email,
        //     },
        //   }
        // );
        // const userExists= response.data.length > 0;
        // if(!userExists){
        //   return res.status(200).send('UnAuthenticated')
        // }
        // SAVE THE USER TO THE DATABSE
    }
    catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
});
exports.saveTheUser = saveTheUser;
