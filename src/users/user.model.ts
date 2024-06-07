import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITodo, ITodoDocument, ITodoModel } from './IUserInterface';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr);
};

const Todo = mongoose.model<ITodoDocument, ITodoModel>('Todo', todoSchema);

export { Todo };
