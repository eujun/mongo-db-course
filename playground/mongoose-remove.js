const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

Todo.findOneAndRemove({
  _id: '59e66eb4c20b9b7014cb034c'
}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove("59e66eb4c20b9b7014cb034c").then((todo) => {
  console.log(todo);
});
