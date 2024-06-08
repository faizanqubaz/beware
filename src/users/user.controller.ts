import express, { Response, Request } from 'express';
import { User } from './user.model';
import { IEmailArc, IUserDocument, IEmailRequestBody } from './IUserInterface';
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
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 400,
      message: 'email should not be empty!',
    });
  }

  const emailData: IEmailArc = {
    to: email,
  };

  try {
    await sendEmailToUser(emailData);

    res.status(200).json({
      status: 200,
      message: 'Email sent successfully',
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
      html:
        '<p>You requested for click the confirmation Link, kindly use this <a href="http://localhost:3000/api/v2/user/confirmation-link?token=' +
        emailData.to +
        '">link</a> for verfication</p>',
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
  const email = req.query.token;

  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://dev-42td93pl.us.auth0.com/api/v2/users-by-email`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          email,
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
    const existingUser = await User.findOne({ email: firstUser.email });
    if (existingUser) {
      return res.status(200).json({
        status: 200,
        message: 'User Already Exist in the DB',
      });
    }
    const newUser: IUserDocument = User.build({
      name: firstUser.name,
      email: firstUser.email,
      created_at: firstUser.created_at,
      username: firstUser.name,
      picture: firstUser.picture,
    });

    await newUser.save();
    console.log('User saved to database:', newUser);
    res.json({
      status: 200,
      message: 'User authenticated and saved to database',
    });
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};

export { SendMail, saveTheUser };
