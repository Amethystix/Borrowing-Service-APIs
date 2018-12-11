const mysql = require('mysql');
const conf = require('../dbconfig');


// results are returned as an array of objects with column names as the keys
// TODO:can also add timeout to the query options

function getResults(SQL, values) {
  // This function is called for all queries since the structure is exactly the same
  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
    multipleStatements: true,
  });

  return new Promise((resolve, reject) => {
    con.query(SQL, values, (err, results) => {
      if (err) reject(err);

      else {
        resolve(results);
      }

      con.end();
    });
  });
}

// User functions


function findUser(username) {
  const SQL = 'SELECT * FROM user WHERE username = ?';
  return getResults(SQL, [username]);
}

// function getUserById(userId) {
//   const con = mysql.createConnection({
//     host: conf.HOST,
//     user: conf.USER,
//     password: conf.PASS,
//     database: conf.DB,
//   });

//   const SQL = 'SELECT * FROM user WHERE userId = ?';

//   return new Promise((resolve, reject) => {
//     con.query(SQL, [userId], (err, result) => {
//       if (err) reject(err);

//       // console.log(result);
//       resolve(result);

//       con.end();
//     });
//   });
// }


function alreadyInDB(username, email) {
  const SQL = 'SELECT username, email FROM user WHERE username = ? OR email = ?';

  return getResults(SQL, [username, email]);
}

function registerUser(userObj) {
  const SQL = 'INSERT INTO user (userId, email, username, password, firstName, lastName, joinedOn) VALUES (?, ?, ?, ?, ?, ?, curdate())';

  const {
    uuid, email, username, password, firstName, lastName,
  } = userObj;

  return getResults(SQL, [uuid, email, username, password, firstName, lastName]);
}



function getUserBorrowed(userId) {
  const SQL = 'SELECT objectName, objectId, ownerUsername, ownerId, reservedOn FROM loan WHERE loanedById = ? AND returnedOn IS NULL;';

  return getResults(SQL, [userId]);
}

function getUserListed(userId) {
  const SQL = 'SELECT ownerUsername, name, objectId, description, pictureURL, zipCode, isReserved FROM object WHERE ownerId = ?;';

  return getResults(SQL, [userId]);
}

/* eslint-disable*/

//object functions

function addObject(itemObj) {

  const SQL = 'INSERT INTO object (objectId, ownerId, ownerUsername, name, description, pictureURL, zipCode, isReserved) VALUES (?,?,?,?,?,?,?,0)';
  const {
       name, location, description, imageUrl, itemId, ownerId, ownerUsername
    } = itemObj;

  return getResults(SQL, [itemId, ownerId, ownerUsername, name, description, imageUrl, location])

}


function getObjectById(objectId){

  const SQL = 'SELECT objectId, name, ownerId, ownerUsername, description, pictureURL, zipCode, isReserved FROM object WHERE objectId = ?'
  return getResults(SQL, [objectId])

}

function loanObject(objectId, userId, username) {
//This query needs to be tested!!
  SQL = 'INSERT INTO loan (objectId, objectName, ownerId, ownerUsername, loanedById, loanedByUsername, reservedOn, returnedOn) SELECT obj.objectId,obj.name,obj.ownerId, obj.ownerUsername,?,?,curdate(), NULL FROM object obj WHERE objectId = ?; UPDATE object SET isReserved = 1 WHERE objectId = ?; ';

  return getResults(SQL, [userId, username, objectId, objectId])

}

function returnItem(itemId, userId){
  SQL = 'UPDATE loan SET returnedOn = curdate() WHERE objectId = ? AND loanedById = ? AND returnedOn IS NULL; UPDATE object SET isReserved = 0 WHERE objectId = ?;';

  return getResults(SQL, [itemId, userId, itemId]);
}


//feed queries

function getFeed(){
  //returns everything that is in the feed table

  const SQL = "SELECT mainPersonId, mainPersonUsername, action, secondaryPersonId, secondaryPersonUsername, objectName, objectId FROM feed ORDER BY timestamp DESC;";

  return getResults(SQL, []);
}

//review
function addRating(username, rating){
  const SQL = "INSERT INTO review (userId, username, rating) SELECT user.userId, user.username, ? FROM user WHERE username = ?"
  return getResults(SQL, [rating, username]);
}


function getUserById(userId){
  const SQL = 'SELECT username FROM user WHERE userId = ?';

  return getResults(SQL, [userId]);
}

module.exports = {
  findUser,
  alreadyInDB,
  registerUser,
  getObjectById,
  addObject,
  loanObject,
  returnItem,
  getFeed,
  getUserBorrowed,
  getUserListed,
  addRating,
  getUserById,

};

