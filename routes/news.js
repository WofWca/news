const KoaRouter = require('koa-router');
const newsController = require('../controllers/news');
const adminTokenAuthMiddleware = require('../middlewares/adminTokenAuth');

const newsRouter = new KoaRouter();

newsRouter.use(adminTokenAuthMiddleware());

newsRouter.get('/', newsController.getAll);
newsRouter.post('/', newsController.create);
newsRouter.put('/:id', newsController.update);
newsRouter.delete('/:id', newsController.delete);

module.exports = newsRouter;
