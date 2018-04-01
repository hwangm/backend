let mysql = require('mysql');
let dotenv = require('dotenv');
let bcrypt = require('bcryptjs');

let mysqlConnection = mysql.createConnection({
  host: process.env.CATS_HOST,
  user: process.env.CATS_USER,
  password: process.env.CATS_PASSWORD,
  database: process.env.CATS_DATABASE,
  ssl: "Amazon RDS"
});
  
mysqlConnection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + mysqlConnection.threadId);
});

let saveCat = (birthdate, breed, imageUrl, name, username, password, weight, callback) => {
  let saveCatQuery = 'insert into cats (addedAt, breed, birthDate, externalId, imageUrl, lastSeenAt, name, password, username, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let addedAt = new Date();
  let lastSeenAt = new Date();
  let hashedPassword = bcrypt.hashSync(password);

  mysqlConnection.query(saveCatQuery, [addedAt, breed, new Date(birthdate), breed+name+username, imageUrl, lastSeenAt, name, hashedPassword, username, weight], (err, result) => {
    if(err){
      callback(err);
    }
    else{
      callback(null, result);
    }
  });
  
};

let usernameTaken = (username, callback) => {
  let usernameQuery = 'select count(*) as count from cats where username=?';
  mysqlConnection.query(usernameQuery, username, (err, result) => {
    if(err){
      console.log('Error: ' + err);
      callback(err);
    }
    if(result[0].count == 0){
      callback(null, false);
    }
    else {
      callback(null, true);
    }
  });
};

let updateSeenAtDate = (username, callback) => {
  let seenAtDate = new Date();
  let updateQuery = 'update cats set lastSeenAt = ? where username = ?';

  mysqlConnection.query(updateQuery, [seenAtDate, username], (err, result) => {
    if(err){
      callback(err);
    }
    else{
      callback(null, result);
    }
  });
};

module.exports.usernameTaken = usernameTaken;
module.exports.saveCat = saveCat;
module.exports.updateSeenAtDate = updateSeenAtDate;

