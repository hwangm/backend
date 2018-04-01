let mysql = require('mysql');
let dotenv = require('dotenv');

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

  mysqlConnection.query(saveCatQuery, [addedAt, breed, new Date(birthdate), breed+name+username, imageUrl, lastSeenAt, name, password, username, weight], (err, result) => {
    if(err){
      callback(err);
    }
    callback(null, result);
  });
  
};

let usernameTaken = (username, callback) => {
  let usernameQuery = 'select count(*) as count from cats where username=?';
  mysqlConnection.query(usernameQuery, username, (err, result) => {
    if(err){
      console.log('Error: ' + err);
      callback(err);
    }
    console.log(result[0].count);
    if(result[0].count == 0){
      callback(null, false);
    }
    else {
      callback(null, true);
    }
  });
};

module.exports.usernameTaken = usernameTaken;
module.exports.saveCat = saveCat;

