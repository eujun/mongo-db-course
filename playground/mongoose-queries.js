const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// var id = '59e66eb4c20b9b7014cb034c';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid.');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log("ID not found.");
//   }
//   console.log('Todo by Id:', todo);
// }).catch((e) => console.log(e));

var id = "59e7a8f53111af5d04a3ff8a";

User.findById(id).then((user) => {
  if(!user){
    return console.log("User not found.");
  }
  console.log('User by Id:', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
