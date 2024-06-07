import mongoose, { Model, Document } from 'mongoose';

interface ITodo {
  title: String;
  description: String;
}

interface ITodoDocument extends ITodo, Document {}

interface ITodoModel extends Model<ITodoDocument> {
  build(attr: ITodo): ITodoDocument;
}

export { ITodo, ITodoDocument, ITodoModel };
