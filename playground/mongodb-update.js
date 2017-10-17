// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  //findOneAndUpdate
  db.collection('Todos').findOneAndUpdate({
    text: 'Job search'
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }). then((result) => {
    console.log(result);
  });

  //increment operator
  db.collection('Users').findOneAndUpdate({
    Name: 'John Oliver'
  }, {
    $set: {
      Name: 'John Smith'
    },
    $inc: {
      Age: 10
    }
  }, {
    returnOriginal: false
  }). then((result) => {
    console.log(result);
  });

  // db.close();
});
