const KoaRouter = require('koa-router');
const adminTokenAuthMiddleware = require('../middlewares/adminTokenAuth');
const newsRouter = require('./news.js');
const usersRouter = require('./users.js');


const rootRouter = new KoaRouter({
  prefix: '/api/v1'
});

newsRouter.use(adminTokenAuthMiddleware(usersCollection));
// Uses basic auth.
rootRouter.use('/news', newsRouter.routes(), newsRouter.allowedMethods());
rootRouter.use('/users', usersRouter.routes(), usersRouter.allowedMethods());

module.exports = rootRouter;
