const basicAuth = require('basic-auth');
const userModel = require('../models/user');

exports.login = async ctx => {
  const credentials = basicAuth(ctx.req);
  if (credentials === undefined) {
    ctx.throw(401, 'Use Basic Authentication');
  }
  const user = await userModel.authenticateBasic(
    credentials.name, credentials.pass);
  if (user === null) {
    ctx.throw(403, 'No such login/password pair');
  } else {
    const newAuthToken = userModel.regenerateUserToken(user._id);
    ctx.body = { authToken: newAuthToken };
  }
};
