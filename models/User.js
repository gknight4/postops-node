var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  useremail: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');