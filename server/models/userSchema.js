var mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt-nodejs')
  , Schema = mongoose.Schema;

  var userSchema = new Schema({
    username: String,
    password: String,
    authorization: String,
    createdAt: Object
  });

  userSchema.methods.toJSON = function(){
    var user = this.toObject();
    delete user.password;
    return user;
  };  

  userSchema.methods.comparePasswords = function(password, callback){
    console.log(password);
    console.log(this.password);
    bcrypt.compare(password, this.password, callback);
  }

  userSchema.pre('save', function(next){
    console.log("In userSchema.pre");
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt){
      if (err) return next(err);

      bcrypt.hash(user.password, salt, null, function(err, hash){
        if (err) return next(err);

        user.password = hash;
        console.log(user);
        next();
      });
    });
  });
  
  var User = mongoose.model('User', userSchema);
  
module.exports = User;
