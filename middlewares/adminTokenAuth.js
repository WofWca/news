const userModel = require('../models/user');

module.exports = function adminTokenAuthMiddleware() {
  return async (ctx, next) => {
    const authHeader = ctx.request.get('Authorization');
    const authMethodStr = 'token ';
    if (!authHeader.startsWith(authMethodStr)) {
      ctx.throw(401, 'Add Authorization header:' +
        '"Authorization: token %YOUR_AUTH_TOKEN%"');
    }
    const authToken = authHeader.slice(authMethodStr.length);
    const user = await userModel.authenticateToken(authToken);
    if (user === null) {
      ctx.throw(403, 'No such token');
    }
    if (user.admin !== true) {
      ctx.throw(403, 'Not admin');
    }
    ctx.state.user = user;
    await next();
  };
};
