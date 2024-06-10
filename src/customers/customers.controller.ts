import express, { Response, Request } from 'express';
import { Customer } from './customer.model';
import {
  IEmailArc,
  ICustomerDocument,
  IEmailRequestBody,
} from './ICustomerInterface';
import nodemailer from 'nodemailer';
import { getAccessToken } from '../utility/auth-config';
import axios from 'axios';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
dotenv.config();

const SendMail = async (
  req: Request<{}, {}, IEmailRequestBody>,
  res: Response,
) => {
  const { email, sender } = req.body;

  if (!email || !sender || !sender.name || !sender.email) {
    return res.status(400).json({
      status: 400,
      message: 'email and sender information should not be empty!',
    });
  }

  const emailData: IEmailArc = {
    to: email,
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
      html: `<p>You have been invited by ${emailData.sender.name} (${emailData.sender.email}). Click the confirmation Link, kindly use this <a href="http://localhost:3000/api/v2/customer/confirmation-link?inviteFrom=${emailData.sender.email}&inviteTo=${emailData.to}">link</a> for verification.</p>`,
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
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://dev-42td93pl.us.auth0.com/api/v2/users-by-email`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          email: inviteTo,
        },
      },
    );

    const userExists = response.data;

    if (!Array.isArray(userExists) || userExists.length === 0) {
      return res.json({
        status: 200,
        message: 'user doesnot exists in Auth0 please signup!!',
      });
    }

    // SAVE THE USER TO THE DATABSE
    const firstUser = userExists[0];
    const existingCustomer = await Customer.findOne({ email: firstUser.email });

    if (existingCustomer) {
      return res.status(200).json({
        status: 200,
        message: 'Customer Already Exist in the DB',
      });
    }
    const newCustomer: ICustomerDocument = Customer.build({
      name: firstUser.name,
      email: firstUser.email,
      created_at: firstUser.created_at,
      username: firstUser.name,
      picture: firstUser.picture,
      inviteFrom: inviteFrom,
    });

    await newCustomer.save();
    console.log('Customer saved to database:', newCustomer);
    res.json({
      status: 200,
      message: 'Customer authenticated and saved to database',
    });
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

export { SendMail, saveTheUser, getAllCustomersBySender };
