const usersCollection = require('../app').usersCollection;
const uuidv4 = require('uuid/v4');
const ObjectID = require('mongodb').ObjectID;

exports.get = async (idStr) => {
  let idObj;
  try {
    idObj = ObjectID(idStr);
  } catch (err) {
    throw new TypeError(`Invalid user id: "${idStr}"`);
  }
  const user = await usersCollection.findOne({ _id: idObj });
  return user;
};

/**
 * @returns user instance with provided credentials or `null` if they are
 * invalid.
 */
exports.authenticateBasic = async (username, password) => {
  const user = await usersCollection.findOne({
    login: username,
    password: password
  });
  return user;
};

/**
 * @returns user instance holding that token or `null` if no one holds it.
 */
exports.authenticateToken = async (token) => {
  const user = await usersCollection.findOne({ authToken: token });
  return user;
};

exports.regenerateUserToken = (userIdStr) => {
  let idObj;
  try {
    idObj = ObjectID(userIdStr);
  } catch (err) {
    throw new TypeError(`Invalid user id: "${userIdStr}"`);
  }
  const newAuthToken = uuidv4();
  usersCollection.updateOne(
    { _id: idObj },
    { $set: { authToken: newAuthToken } }
  );
  return newAuthToken;
};
