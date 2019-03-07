'use strict';

const Koa = require('koa');
const rootRouter = require('./routes/root');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('koa-bodyparser');

// TODO get from env?
const PORT = 8000;
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'news_app';

let db;
let newsCollection;
let usersCollection;
const dbClient = new MongoClient(MONGO_URL, { useNewUrlParser: true });
const dbConnectPromise = dbClient.connect();

const app = new Koa();

app.use(bodyParser());

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

dbConnectPromise.then(() => { 
  db = dbClient.db(DB_NAME);
  newsCollection = db.collection('news');
  usersCollection = db.collection('users');
  app.listen(PORT);
});
