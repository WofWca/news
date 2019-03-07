const newsModel = require('../models/news');
const userModel = require('../models/user');

exports.getAll = async ctx => {
  ctx.body = await newsModel.getAll();
};

/**
 * Create a piece of news. If `authorId` is not specified, whoever made the
 * request becomes the author.
 */
exports.create = async ctx => {
  let author;
  if (ctx.request.body.hasOwnProperty('authorId')) {
    try {
      author = await userModel.get(ctx.request.body.authorId);
    } catch (err) {
      ctx.throw(400, 'Invalid authorId');
    }
    if (author === null) {
      ctx.throw(400, 'No user with specified authorId found');
    }
  } else {
    author = ctx.state.user;
  }
  const authorId = author._id;
  const newPieceOfNews = Object.assign({}, ctx.request.body);
  newPieceOfNews.authorId = authorId;
  const res = await newsModel.create(newPieceOfNews);
  ctx.body = res;
};

exports.update = async ctx => {
  let res;
  try {
    res = await newsModel.update(ctx.params.id, ctx.request.body);
  } catch (err) {
    ctx.throw(400, `Invalid news ID: "${ctx.params.id}"`);
  }
  ctx.body = res;
};

exports.delete = async ctx => {
  let res;
  try {
    res = await newsModel.delete(ctx.params.id);
  } catch (err) {
    ctx.throw(400, `Invalid news ID: "${ctx.params.id}"`);
  }
  ctx.body = res;
};
