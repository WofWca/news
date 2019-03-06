'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const bodyParser = require('koa-bodyparser');
const basicAuth = require('basic-auth');
const uuidv4 = require('uuid/v4');

// const newModel = // TODO
const PORT = 8000; // TODO
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'news_app';

let db;
let newsCollection;
let usersCollection;
const dbClient = new MongoClient(MONGO_URL, { useNewUrlParser: true });
const dbConnectPromise = dbClient.connect();

const app = new Koa();
const rootRouter = new KoaRouter({
  prefix: '/api/v1'
});
const newsRouter = new KoaRouter();

app.use(bodyParser());

function adminTokenAuthMiddleware() {
  return async (ctx, next) => {
    const authHeader = ctx.request.get('Authorization');
    const authMethodStr = 'token ';
    if (!authHeader.startsWith(authMethodStr)) {
      ctx.throw(401, 'Add Authorization header:' +
        '"Authorization: token %YOUR_AUTH_TOKEN%"');
    }
    const authToken = authHeader.slice(authMethodStr.length);
    const user = await usersCollection.findOne({authToken: authToken});
    if (!user) {
      ctx.throw (401, 'No such token');
    }
    if (!user.admin) {
      ctx.throw(401, 'Not admin');
    }
    ctx.state.user = user;
    await next();
  };
}
newsRouter.use(adminTokenAuthMiddleware());

newsRouter.get('/', async ctx => {
  ctx.body = await newsCollection.find({}).toArray();
});
newsRouter.post('/', async ctx => {
  const newNews = ctx.request.body;
  if (!newNews.author) {
    newNews.authorId = ctx.state.user._id;
  }
  const res = await newsCollection.insertOne(newNews);
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

// Uses basic auth.
rootRouter.post('/generate-token', async ctx => {
  const { name, pass } = basicAuth(ctx.req);
  const user = await usersCollection.findOne({ login: name, password: pass });
  if (!user) {
    ctx.throw(401, 'No such login/password pair');
  } else {
    const newAuthToken = uuidv4();
    ctx.body = { authToken: newAuthToken };
    usersCollection.updateOne(
      { _id: user._id },
      { $set: { authToken: newAuthToken }}
    );
  }
});

rootRouter.use('/news', newsRouter.routes(), newsRouter.allowedMethods());

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

dbConnectPromise.then(() => { 
  db = dbClient.db(DB_NAME);
  newsCollection = db.collection('news');
  usersCollection = db.collection('users');
  app.listen(PORT);
});
