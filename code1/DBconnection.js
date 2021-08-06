var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

export const mongoConnection = (collection, postObj) => {
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
