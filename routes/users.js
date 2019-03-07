const KoaRouter = require('koa-router');
const usersController = require('../controllers/users');

const usersRouter = new KoaRouter();

usersRouter.post('/login', usersController.login);

module.exports = usersController;
