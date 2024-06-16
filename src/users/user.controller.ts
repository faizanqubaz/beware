import express, { Response, Request } from 'express';
import { IUserDocument } from './Iuser.interface';
import { User } from './user.model';
import dotenv from 'dotenv';
import { findUserByEmail } from '../utility/findone.utils';
dotenv.config();

const getAllUserByEmail = async (req: Request, res: Response) => {
  const { email: useremail } = req.query;

  if (!useremail) {
    return res.status(400).json({
      status: 400,
      message: 'userEmail query parameter is required!',
    });
  }

  try {
    const user = await findUserByEmail(useremail as string);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'No User found for this email',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'User found',
      data: user, // Include user data in the response if needed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while fetching the user',
    });
  }
};

export { getAllUserByEmail };
