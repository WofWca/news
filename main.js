'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
// const newModel = // TODO
const PORT = 8000; // TODO

const app = new Koa();
const rootRouter = new KoaRouter();
const newsRouter = new KoaRouter();

newsRouter.get('/', ctx => {
  ctx.body = [{ asd: 1 }, { asd: 2 }]; // TODO
});
newsRouter.post('/', ctx => {

});
newsRouter.put('/:id', ctx => {
  ctx.body = `Changed ${ctx.params.id}`; // TODO
});
newsRouter.delete('/:id', ctx => {

});

rootRouter.use('/api/v1/news', newsRouter.routes(), newsRouter.allowedMethods());

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

app.listen(PORT);