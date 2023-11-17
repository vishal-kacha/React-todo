import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();

app.use(express.json());

import { MongoClient } from 'mongodb';
const uri = process.env.MongoString;
const client = new MongoClient(uri);
const datbase = client.db('Todoapp');
const collection = datbase.collection('todousr');

async function Getodo() {
  const todo = await collection.find({}, { _id: 1, todos: 1 }).toArray();
  return todo;
}

async function SaveTodo(params) {
  await collection.updateOne(
    { userid: "65561f574473a0dd205195e7"},
    { $set: { savedTodo: [...params] } }
  );
}

const router = Router();
router.get('/', async (req, res) => {
  const todos = await Getodo();
  res.send({...todos});
  res.end();
});

router.post('/', async (req, res) => {
  await SaveTodo(req.body);
  res.send("Updated todo");
})

app.use('/.netlify/functions/api', router);


export const handler = serverless(app);