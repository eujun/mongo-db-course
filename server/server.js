var express = require('express');
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

// POST routes
app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET routes
app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;
  console.log(id);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send("ID not found.");
    }
    res.send({
      todo             // same as todo: todo
    });
  }).catch((e) => res.status(400).send());
});

// Starts server
app.listen(3000, () => {
  console.log('Stated on port 3000');
});
// var newTodo = new Todo({
//   text: 'Edit video'
// });
//
// newTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save todo', e)
// });
//
//
//
// var newUser = new User({
//   email: "qwqe32@dasdsd.com"
// });
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save user', e);
// });
