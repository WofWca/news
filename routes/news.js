const KoaRouter = require('koa-router');
const newsController = require('../controllers/news');

const newsRouter = new KoaRouter();

newsRouter.get('/', newsController.getAll);
newsRouter.post('/', newsController.create);
newsRouter.put('/:id', newsController.update);
newsRouter.delete('/:id', newsController.delete);

module.exports = newsRouter;
