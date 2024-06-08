import express, { Response, Request } from 'express';
import { User } from './user.model';

const Register = async (req: Request, res: Response) => {
  const { name, username,password } = req.body;
  const user = User.build({ name, username,password });

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export { Register };
