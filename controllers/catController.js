let mysql = require('mysql');
let dotenv = require('dotenv').config();
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
      return callback(err);
    }
    else{
      return callback(null, result);
    }
  });
  
};

let usernameTaken = (username, callback) => {
  let usernameQuery = 'select count(*) as count from cats where username=?';
  mysqlConnection.query(usernameQuery, username, (err, result) => {
    if(err){
      console.log('Error: ' + err);
      return callback(err);
    }
    if(result[0].count == 0){
      return callback(null, false);
    }
    else {
      return callback(null, true);
    }
  });
};

let isValidPassword = (username, password, callback) => {
  let passwordQuery = 'select password from cats where username=?';
  mysqlConnection.query(passwordQuery, username, (err, result) => {
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if(isMatch){
        return callback(null, true);
      }
      else{
        return callback(null, false);
      }
    });
  });
};

let updateSeenAtDate = (username, callback) => {
  let seenAtDate = new Date();
  let updateQuery = 'update cats set lastSeenAt = ? where username = ?';

  mysqlConnection.query(updateQuery, [seenAtDate, username], (err, result) => {
    if(err){
      return callback(err);
    }
    else{
      return callback(null, result);
    }
  });
};

let getCats = (externalId, name, username, callback) => {
  let criteriaNames = ['externalId', 'name', 'username'];

  let whereClause = [externalId, name, username].reduce((p, c, index) => {
    if(c){
      if(p != ''){
        return p + ' and ' + criteriaNames[index] + '=' + mysql.escape(c);
      }
      else{
        return p + ' where ' + criteriaNames[index] + '=' + mysql.escape(c);
      }
    }
    else return p;
  }, '');
  let sortByClause = ' order by lastSeenAt';
  let selectCatQuery = "select birthdate, breed, username, externalId, imageUrl, name from cats" + whereClause + sortByClause;
  mysqlConnection.query(selectCatQuery, (err, result) => {
    if(err){
      return callback(err);
    }
    return callback(null, result);
  });
};

let getRandomCat = (callback) => {
  let idListQuery = 'select id from cats';
  mysqlConnection.query(idListQuery, (err, idList) => {
    if(err){
      return callback(err);
    }
    let catId = idList[Math.floor(Math.random() * idList.length)].id;
    let selectRandomCatQuery = 'select imageUrl, name, breed from cats where id=?';
    mysqlConnection.query(selectRandomCatQuery, catId, (err, catInfo) => {
      if(err){
        return callback(err);
      }
      return callback(null, catInfo[0]);
    });
  });
  
};

module.exports.usernameTaken = usernameTaken;
module.exports.saveCat = saveCat;
module.exports.updateSeenAtDate = updateSeenAtDate;
module.exports.isValidPassword = isValidPassword;
module.exports.getCats = getCats;
module.exports.getRandomCat = getRandomCat;

