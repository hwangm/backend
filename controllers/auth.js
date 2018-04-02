let dotenv = require('dotenv').config();
let catController = require('./catController');
let jwt = require('jsonwebtoken');

let authUser = (username, callback) => {
  let token = jwt.sign({'username': username}, process.env.APP_SECRET, {
    expiresIn: 86400
  });
  return callback(null, {'authToken': token});
};

let isValidToken = (token, callback) => {
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err){
      return callback(err);
    }
    let username = decoded['username'];
    catController.usernameTaken(username, (err, isTaken) => {
      if(err || !isTaken){
        return callback(null, false);
      }
      return callback(null, true);
    });
  });
}

module.exports.authUser = authUser;
module.exports.isValidToken = isValidToken;