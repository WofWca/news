'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const bodyParser = require('koa-bodyparser');
// const newModel = // TODO
const PORT = 8000; // TODO
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'news_app';

let db;
let newsCollection;
const dbClient = new MongoClient(MONGO_URL, { useNewUrlParser: true });
const dbConnectPromise = dbClient.connect();

const app = new Koa();
const rootRouter = new KoaRouter();
const newsRouter = new KoaRouter();

app.use(bodyParser());

// TODO auth
// TODO author id
// TODO validation?
// TODO is async+await ok in these?
newsRouter.get('/', async ctx => {
  ctx.body = await newsCollection.find({}).toArray();
});
newsRouter.post('/', async ctx => {
  const res = await newsCollection.insertOne(ctx.request.body);
  ctx.body = res.result;
});
newsRouter.put('/:id', async ctx => {
  const query = { _id: new ObjectID(ctx.params.id) };
  const update = {
    $set: ctx.request.body
  };
  const res = await newsCollection.updateOne(query, update);
  ctx.body = res.result;
});
newsRouter.delete('/:id', async ctx => {
  const res = await newsCollection.deleteOne({
    _id: new ObjectID(ctx.params.id)
  });
  ctx.body = res.result;
});

rootRouter.use('/api/v1/news', newsRouter.routes(), newsRouter.allowedMethods());

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

dbConnectPromise.then(() => { 
  db = dbClient.db(DB_NAME);
  newsCollection = db.collection('news');
  app.listen(PORT);
});
