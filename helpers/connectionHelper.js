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

      resolve(result);

      con.end();
    });
  });
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

function getUserBorrowed(userId) {
  const SQL = 'SELECT objectName, objectId, ownerUsername, ownerId, reservedOn FROM loan WHERE loanedById = ? AND returnedOn IS NULL;';

  return getResults(SQL, [userId]);
}

function getUserListed(userId) {
  const SQL = 'SELECT name, objectId, description, pictureURL, zipCode, isReserved FROM object WHERE ownerId = ?;';

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
  SQL = 'INSERT INTO loan (objectId, objectName, ownerId, ownerUsername, loanedById, loanedByUsername, reservedOn, returnedOn) SELECT obj.objectId,obj.name,obj.ownerId, obj.ownerUsername,?,?,curdate(), NULL FROM object obj WHERE objectId = ?; ';

  return getResults(SQL, [userId, username, objectId])

}

function returnItem(itemId, userId){
  SQL = 'UPDATE loan SET returnedOn = curdate() WHERE objectId = ? AND loanedById = ? AND returnedOn IS NULL;';

  return getResults(SQL, [itemId, userId]);
}


//feed queries

function getFeed(){
  //returns everything that is in the feed table

  const SQL = "SELECT mainPersonId, mainPersonUsername, action, secondaryPersonId, secondaryPersonUsername, objectName, objectId FROM feed ORDER BY timestamp;";

  return getResults(SQL, []);
}

function getObjectIdByItemName(itemName){
  const SQL = 'SELECT objectId, name, ownerId, ownerUsername, description, pictureURL, zipCode, isReserved FROM object WHERE objectName = ?';
  return getResults(SQL, [itemName]);

}

function getObjectIdByZipcode(zipCode){
  const SQL = 'SELECT objectId, name, ownerId, ownerUsername, description, pictureURL, zipCode, isReserved FROM object WHERE zipCode = ?';
  return getResults(SQL, [zipCode]);

}

function getObjectIdByName(name){
  const SQL = 'SELECT objectId, name, ownerId, ownerUsername, description, pictureURL, zipCode, isReserved FROM object WHERE user.firstName = ? OR user.lastName = ?';
  return getResults(SQL, [name, name]);
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
  getObjectIdByZipcode,
  getObjectIdByName,
  getObjectIdByItemName
};

