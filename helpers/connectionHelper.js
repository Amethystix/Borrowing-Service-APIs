const mysql = require('mysql');
const conf = require('../dbconfig');


// results are returned as an array of objects with column names as the keys
// TODO:can also add timeout to the query options


function findUser(username) {
  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
  });

  const SQL = 'SELECT * FROM user WHERE username = ?';

  return new Promise((resolve, reject) => {
    con.query(SQL, [username], (err, result) => {
      if (err) reject(err);

      // console.log(result);
      resolve(result);

      con.end();
    });
  });
}


function alreadyInDB(username, email) {
  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
  });
  // let user = null;


  const SQL = 'SELECT username, email FROM user WHERE username = ? OR email = ?';

  return new Promise((resolve, reject) => {
    con.query(SQL, [username, email], (err, results) => {
      // try putting the entire results into the resolve and error checking from there

      if (err) reject(err);

      resolve(results);

      con.end();
    });
  });
}

function registerUser(userObj) {
  const SQL = 'INSERT INTO user (userId, email, username, password, firstName, lastName, joinedOn) VALUES (?, ?, ?, ?, ?, ?, curdate())';

  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
  });

  return new Promise((resolve, reject) => {
    const {
      uuid, email, username, password, firstName, lastName,
    } = userObj;
    con.query(SQL, [uuid, email, username, password, firstName, lastName],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

    con.end();
  });
}

/* eslint-disable*/

function addObject(obj) {
/* objectId INT NOT NULL PRIMARY KEY
  ,ownerId INT NOT NULL REFERENCES user(userId)
  ,ownerName VARCHAR(255)
  ,name VARCHAR(100)
  ,picture VARCHAR(255)
  ,price DECIMAL(20, 4)
  ,latitude DECIMAL(30, 15)
  ,longitude DECIMAL(30, 15)
  ,isReserved TINYINT */

  const SQL = 'INSERT INTO object VALUES (?,?,?,?,?,?,?,?,0)';
}

function getObject(objectName) {
  const SQL = 'SELECT objectId';
}

function loanObject(objectId) {
  // first find the object and get the name
}


module.exports = {
  findUser,
  alreadyInDB,
  registerUser,
};
