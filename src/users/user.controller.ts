import express, { Response, Request } from 'express';
import { IUserDocument } from './Iuser.interface';
import { User } from './user.model';
import dotenv from 'dotenv';
dotenv.config();

const register = async (req: Request, res: Response) => {
  const { email, name, username } = req.body;

  if (!email || !name || !username) {
    return res.status(400).json({
      status: 400,
      message: 'email and name information should not be empty!',
    });
  }

  try {
    const newuser: IUserDocument = User.build({
      name: name,
      email: email,
      username: username,
      role: 'user',
    });

    const userData = await newuser.save();

    res.status(201).json({
      status: 200,
      message: 'user saved to the database',
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error sending email: ${error}`,
    });
  }
};

export { register };
