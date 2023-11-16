import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();

import { MongoClient } from 'mongodb';
const uri = process.env.MongoString;
const client = new MongoClient(uri);

async function Getodo() {
  const datbase = client.db('Todoapp');
  const collection = datbase.collection('todousr');

  const todo = await collection.find({}, { _id: 1, todos: 1 }).toArray();
  return todo;
}

const router = Router();
router.get('/', async (req, res) => {
  const todos = await Getodo();
  res.send({...todos});
  res.end();
});

app.use('/.netlify/functions/api', router);


export const handler = serverless(app);