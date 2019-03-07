const newsCollection = require('../app').newsCollection;
const ObjectID = require('mongodb').ObjectID;

/**
 * Converts `parsedJson`'s id string fields to MongoDB's ObjectID.
 * Does not mutate the original object, returns a new one.
 */
function jsonToMongoDocument(parsedJson, idStrFieldNames) {
  const documentObj = Object.assign({}, parsedJson);
  for (let filedName of idStrFieldNames) {
    try {
      documentObj[filedName] = ObjectID(parsedJson[filedName]);
    } catch (originalError) {
      throw new TypeError(`Could not convert "${parsedJson[filedName]}" ` +
        'string to mongodb.ObjectId');
    }
  }
  return documentObj;
}

const authorIdFieldName = 'authorId';

exports.getAll = async () => {
  const newsArr = await newsCollection.find({}).toArray();
  return newsArr;
};

exports.create = async (parsedJson) => {
  let doc;
  try {
    doc = jsonToMongoDocument(parsedJson, [authorIdFieldName]);
  } catch (originalError) {
    throw new TypeError(`Invalid format: ${originalError}`);
  }
  const result = await newsCollection.insertOne(doc);
  return result.result;
};

/**
 * @param {object} updateParsedJson contains fields that are to be changed.
 */
exports.update = async (idStr, updateParsedJson) => {
  let idObj;
  try {
    idObj = ObjectID(idStr);
  } catch (err) {
    throw new TypeError(`Invalid news id "${idStr}"`);
  }
  let update;
  if (updateParsedJson.hasOwnProperty(authorIdFieldName)) {
    try {
      update = jsonToMongoDocument(updateParsedJson, [authorIdFieldName]);
    } catch (originalError) {
      throw new TypeError(`Invalid format: ${originalError}`);
    }
  } else {
    update = updateParsedJson;
  }
  const result = await newsCollection.updateOne(
    { _id: idObj },
    { $set: update }
  );
  return result.result;
};

exports.delete = async (idStr) => {
  let idObj;
  try {
    idObj = ObjectID(idStr);
  } catch (err) {
    throw new TypeError(`Invalid news id "${idStr}"`);
  }
  const result = await newsCollection.deleteOne({
    _id: idObj
  });
  return result.result;
};
