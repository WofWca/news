const KoaRouter = require('koa-router');
const adminTokenAuthMiddleware = require('../middlewares/adminTokenAuth');
const newsRouter = require('./news.js');
const basicAuth = require('basic-auth');
const uuidv4 = require('uuid/v4');


const rootRouter = new KoaRouter({
  prefix: '/api/v1'
});

newsRouter.use(adminTokenAuthMiddleware(usersCollection));
// Uses basic auth.
rootRouter.post('/generate-token', async ctx => {
  const credentials = basicAuth(ctx.req);
  if (credentials === undefined) {
    ctx.throw(401, 'Use Basic Authentication');
  }
  const user = await usersCollection.findOne({
    login: credentials.name,
    password: credentials.pass
  });
  if (user === null) {
    ctx.throw(403, 'No such login/password pair');
  } else {
    const newAuthToken = uuidv4();
    ctx.body = { authToken: newAuthToken };
    usersCollection.updateOne(
      { _id: user._id },
      { $set: { authToken: newAuthToken } }
    );
  }
});

rootRouter.use('/news', newsRouter.routes(), newsRouter.allowedMethods());

module.exports = rootRouter;
