'use strict';

const Koa = require('koa');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('koa-bodyparser');

// TODO get from env?
const PORT = 8000;
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'news_app';

const dbClient = new MongoClient(MONGO_URL, { useNewUrlParser: true });
dbClient.connect().then(() => {
  const db = dbClient.db(DB_NAME);
  exports.newsCollection = db.collection('news');
  exports.usersCollection = db.collection('users');
  // rootRouter depends on this file's exports.
  const rootRouter = require('./routes/root');
  const app = new Koa();
  app.use(bodyParser());
  app
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods());
  app.listen(PORT);
});
