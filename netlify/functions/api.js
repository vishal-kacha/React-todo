import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();

app.use(express.json());

import { MongoClient, ObjectId } from 'mongodb';
const uri = process.env.MongoString;
const client = new MongoClient(uri);
const datbase = client.db('Todoapp');
const collection = datbase.collection('todousr');

async function CreateUsr() {
  const userid = new ObjectId().toString();
  const usr = await collection.insertOne(
    { userid: userid, savedTodo: ["Test"] }
  );

  return userid;
}

async function Getodo(paramUserId) {
  const todo = await collection.find(
    { userid: paramUserId},
    { projection: { savedTodo: 1, _id: 0 }}
  ).toArray();
  return todo;
}

async function SaveTodo(userId, params) {
  await collection.updateOne(
    { userid: userId},
    { $set: { savedTodo: [...params] } }
  );
}

const router = Router();
router.get('/', async (req, res) => {
  const { userid } = req.query;
  const todos = await Getodo(userid);
  res.send({...todos});
});

router.put('/', async (req, res) => {
  const usr = await CreateUsr();
  res.send({ usr });
})
  
router.post('/', async (req, res) => {
  const { userid } = req.query;
  await SaveTodo(userid, req.body);
  res.send("Updated todo");
})

app.use('/.netlify/functions/api', router);


export const handler = serverless(app);