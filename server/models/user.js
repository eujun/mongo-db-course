const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//Shows only primary id and email, hides all other information
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

//generate authentication token for user
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access: access, token: token});

  return user.save().then(() => {
    return token;
  });
};

//remove the token
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  })
};

//find user by token
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

 try {
   decoded = jwt.verify(token, 'abc123');
 }
 catch (e) {
  return Promise.reject("Unable to authenticate.");
 }

 return User.findOne({
   '_id': decoded._id,
   'tokens.token': token,
   'tokens.access': 'auth'
 });
};

//find user by email and password
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject("User not found.");
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        }
        else {
          reject("Invalid password");
        }
      });
    });
  });
};

//salt and hash password if changed
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }
});


// User
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
