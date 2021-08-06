var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

export const mongoInsertConnection = (collection, postObj) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

    dbo.collection(collection).insertMany(postObj, function (err, res) {
      if (err) throw err;
      console.log("Number of objects inserted: " + res.insertedCount);
      db.close();
    });
  });
};

export const mongoFindConnection = (collection, query) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    let finalQuery = typeof query == "undefined" || query == "" || query == null ? {} : query;
    dbo.collection(collection).find(finalQuery, function (err, result) {
      if (err) throw err;
      db.close();
      return result;
    });
  });
};
