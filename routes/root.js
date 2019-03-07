const KoaRouter = require('koa-router');
const newsRouter = require('./news.js');
const usersRouter = require('./users.js');

const rootRouter = new KoaRouter({
  prefix: '/api/v1'
});

rootRouter.use('/news', newsRouter.routes(), newsRouter.allowedMethods());
rootRouter.use('/users', usersRouter.routes(), usersRouter.allowedMethods());

module.exports = rootRouter;
