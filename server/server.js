const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT || 3000

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

//DELETE routes
app.delete('/todos/:id', (req,res) =>{
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send("ID not found.");
    }
    res.send({
      todo             // same as todo: todo or send(todo)
    });
  }).catch((e) => res.status(400).send());
});

//PATCH routes
app.patch('/todos/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send("ID not found.")
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

// Starts server
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


// CREATE NEW Todo
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
// CREATE NEW USER
// var newUser = new User({
//   email: "qwqe32@dasdsd.com"
// });
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save user', e);
// });
