import express, { Response, Request } from 'express';
import { Customer } from './customer.model';
import { User } from '../users/user.model';
import {
  getManagementToken,
  getUserFromManagementToken,
} from '../utility/auth.utility';
import axios from 'axios';
import qs from 'qs';
import {
  IEmailArc,
  ICustomerDocument,
  IEmailRequestBody,
} from './ICustomerInterface';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
dotenv.config();

const SendInvite = async (
  req: Request<{}, {}, IEmailRequestBody>,
  res: Response,
) => {
  const { useremail, sender } = req.body;

  if (!useremail || !sender || !sender.name || !sender.email) {
    return res.status(400).json({
      status: 400,
      message: 'email and sender information should not be empty!',
    });
  }

  const emailData: IEmailArc = {
    to: useremail,
    sender: sender,
  };

  try {
    const inviteDetails = await sendEmailToUser(emailData);

    res.status(200).json({
      status: 200,
      message: 'Email sent successfully',
      inviteDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error sending email: ${error}`,
    });
  }
};

const sendEmailToUser: (
  emailData: IEmailArc,
) => Promise<SMTPTransport.SentMessageInfo> = async (emailData: IEmailArc) => {
  const staticSubject: string = 'Confirmation Link';
  try {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
      nodemailer.createTransport({
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

    const data: SMTPTransport.SentMessageInfo =
      await transporter.sendMail(mailData);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const saveTheUser = async (req: Request, res: Response) => {
  const inviteTo: string | undefined = req.query.inviteTo as string | undefined;
  const inviteFrom: string | undefined = req.query.inviteFrom as
    | string
    | undefined;

  if (!inviteTo || !inviteFrom) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid or missing invite parameters!',
    });
  }

  try {
    const userExists = await User.findOne({ email: inviteTo });

    if (!userExists) {
      const state = JSON.stringify({ inviteTo, inviteFrom });
      const authUrl =
        `https://dev-nl5xd2r8c23rplbr.us.auth0.com/authorize?` +
        qs.stringify({
          client_id: 'L3eoXDSx4mpLrxWxic528L3Rg2dEMopi',
          response_type: 'code',
          redirect_uri: '',
          scope: 'openid profile email read:users',
          audience: `https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/`,
          state,
        });
      console.log('authurl', authUrl);

      return res.redirect(authUrl);
    }

    //IF USER EXIST SAVE THE USER TO THE CUSTOMER TABLE
    const existingCustomer = await Customer.findOne({
      email: userExists.email,
    });

    if (existingCustomer) {
      return res.redirect(
        `http://localhost:3000?email=${existingCustomer.email}&name=${existingCustomer.name}`,
      );
    }
    const newCustomer: ICustomerDocument = Customer.build({
      name: userExists.name,
      email: userExists.email,
      created_at: new Date().toDateString(),
      username: userExists.name,
      picture: 'http',
      inviteFrom: inviteFrom,
    });

    await newCustomer.save();
    console.log('Customer saved to database:', newCustomer);
    return res.redirect(
      `http://localhost:3000?email=${newCustomer.email}&name=${newCustomer.name}`,
    );
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};

const getAllCustomersBySender = async (req: Request, res: Response) => {
  const { email: senderEmail } = req.query;

  if (!senderEmail) {
    return res.status(400).json({
      status: 400,
      message: 'senderEmail query parameter is required!',
    });
  }

  try {
    const customers = await Customer.find({ inviteFrom: senderEmail });

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
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      status: 500,
      message: 'Error fetching customers',
    });
  }
};

const getAuthorizationCode = async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;

  if (!code || !state) {
    return res.status(400).json({
      status: 400,
      message: 'Authorization code or state is missing!',
    });
  }

  const { inviteTo, inviteFrom } = JSON.parse(state);
  const managementToken = await getManagementToken();

  const UserFromManagementToken = await getUserFromManagementToken(
    managementToken,
    inviteTo,
  );

  // SAVE THAT INTO THE CUSTOMER TABLE ALSO

  const newCustomerAdded: ICustomerDocument = Customer.build({
    name: UserFromManagementToken[0].given_name,
    email: UserFromManagementToken[0].email,
    created_at: new Date().toDateString(),
    username: UserFromManagementToken[0].name,
    picture: 'http',
    inviteFrom: inviteFrom,
  });

  await newCustomerAdded.save();

  return res.redirect(
    `http://localhost:3000?email=${UserFromManagementToken[0].email}&name=${UserFromManagementToken[0].name}`,
  );
};

export {
  SendInvite,
  saveTheUser,
  getAllCustomersBySender,
  getAuthorizationCode,
};
