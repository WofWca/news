const KoaRouter = require('koa-router');

const newsRouter = new KoaRouter();
const ObjectID = mongodb.ObjectID;
const mongodb = require('mongodb');

async function getAuthorIdObjByIdStr(authorIdStr, authorsCollection) {
  let authrorIdObj;
  try {
    authrorIdObj = ObjectID(authorIdStr);
  } catch (err) {
    throw 'Invalid authorId';
  }
  const author = await authorsCollection.findOne({ _id: authrorIdObj });
  if (author === null) {
    throw 'No user specified by authorId found';
  }
  return authrorIdObj;
}
newsRouter.get('/', async ctx => {
  ctx.body = await newsCollection.find({}).toArray();
});
newsRouter.post('/', async ctx => {
  const newNews = ctx.request.body;
  if (!newNews.hasOwnProperty('authorId')) {
    newNews.authorId = ctx.state.user._id;
  } else {
    // Convert authorId string to authorId object.
    try {
      newNews.authorId =
        await getAuthorIdObjByIdStr(newNews.authorId, usersCollection);
    } catch (err) {
      ctx.throw(400, err);
    }
  }
  const res = await newsCollection.insertOne(newNews);
  ctx.body = res.result;
});
newsRouter.put('/:id', async ctx => {
  const query = { _id: new ObjectID(ctx.params.id) };
  const update = {
    $set: ctx.request.body
  };
  if (update.$set.hasOwnProperty('authorId')) {
    // Convert authorId string to authorId object.
    try {
      update.$set.authorId =
        await getAuthorIdObjByIdStr(update.$set.authorId, usersCollection);
    } catch (err) {
      ctx.throw(400, err);
    }
  }
  const res = await newsCollection.updateOne(query, update);
  ctx.body = res.result;
});
newsRouter.delete('/:id', async ctx => {
  const res = await newsCollection.deleteOne({
    _id: new ObjectID(ctx.params.id)
  });
  ctx.body = res.result;
});

module.exports = newsRouter;
