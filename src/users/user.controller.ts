import express, { Response, Request } from 'express';
import { Todo } from './user.model';

const Register = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const todo = Todo.build({ title, description });

  try {
    await todo.save();
    res.status(201).send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
};

export { Register };
