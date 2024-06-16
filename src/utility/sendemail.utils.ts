import express, { Response, Request } from 'express';
import { Customer } from '../customers/customer.model';
import { User } from '../users/user.model';
import {
  getManagementToken,
  getUserFromManagementToken,
} from '../utility/auth.utility';
import qs from 'qs';
import {
  IEmailArc,
  ICustomerDocument,
  IEmailRequestBody,
} from '../customers/ICustomerInterface';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
import { IUserDocument } from '../users/Iuser.interface';
dotenv.config();

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
      html: `<p>You have been invited by ${emailData.sender.name} (${emailData.sender.email}). Click the confirmation Link, kindly use this <a href="http://localhost:5000/api/v2/customer/confirmation-link?inviteFrom=${emailData.sender.email}&inviteTo=${emailData.to}&role=${emailData.role}">link</a> for verification.</p>`,
    };

    const data: SMTPTransport.SentMessageInfo =
      await transporter.sendMail(mailData);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { sendEmailToUser };
