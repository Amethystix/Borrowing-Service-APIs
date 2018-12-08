const mysql = require('mysql');
const conf = require('../dbconfig');


// results are returned as an array of objects with column names as the keys
// TODO:can also add timeout to the query options

function getResults(SQL, values){
  //This function is called for all queries since the structure is exactly the same
  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
  });

  return new Promise((resolve, reject)=>{
    con.query(SQL, values, (err, results)=>{
      if (err) reject(err);
      else{
        resolve(results)
      }

      con.end()

    });
  });
  
}

//User functions





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

function getUserById(userId){
  const con = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PASS,
    database: conf.DB,
  });

  const SQL = 'SELECT * FROM user WHERE userId = ?';

  return new Promise((resolve, reject) => {
    con.query(SQL, [userId], (err, result) => {
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

//object functions

function addObject(itemObj) {

  const SQL = 'INSERT INTO object (objectId, ownerId, ownerUsername, name, description, pictureURL, zipCode, isReserved) VALUES (?,?,?,?,?,?,?,0)';
  const {
       name, location, description, imageUrl, itemId, ownerId, ownerUsername
    } = itemObj;

  return getResults(SQL, [objectId, ownerId, ownerUsername, name, description, pictureURL, zipCode])

}


function getObjectById(objectId){

  const SQL = 'SELECT objectId, name, ownerId, ownerUsername, description, pictureURL, zipCode, isReserved FROM object WHERE objectId = ?'
  return getResults(SQL, [objectId])

}

function loanObject(objectId, userId, username) {
  // first find the object and get the name

  /*
  /// object table
  objectId INT NOT NULL PRIMARY KEY
  ,ownerId INT NOT NULL REFERENCES user(userId)
  ,ownerUsername VARCHAR(255)
  ,name VARCHAR(100)
  ,description LONGTEXT
  ,pictureURL VARCHAR(255) 
  ,zipCode INT
  ,isReserved TINYINT

  ///loan table

  objectId INT REFERENCES object(objectId)
  ,objectName VARCHAR(100)
  ,ownerId INT REFERENCES object(ownerId)
  ,ownerUsername VARCHAR(255)
  ,loanedById INT REFERENCES user(userId)
  ,loanedByUsername VARCHAR(255)
  ,reservedOn DATE
  ,returnedOn DATE
  */
  SQLToFindObject = 'SELECT ownerId, ownerUsername, name FROM object WHERE objectId = ?';
  SQLToLoan = 'INSERT INTO loan (objectId, objectName, ownerId, ownerUsername, loanedById, loanedByUsername, reservedOn, returnedOn) VALUES (?,?,?,?,?,?,curdate, NULL)';


  getResults(SQLToFindObject, [objectId]).then((results)=>{
    if (results.length == 1){
      item = results[0]
      return getResults(SQLToLoan, [objectId, item.name, item.ownerId, item.ownerUsername, userId, username])
    }
    else{
      return null
    }

  }).catch((err)=>{return err})

  
}

function returnItem(itemId, userId){
  SQL = 'UPDATE loan SET returnedOn = curdate WHERE objectId = ? AND loanedById = ? AND returnedOn IS NULL'

  return getResults(SQL, [itemId, userId])
}


module.exports = {
  findUser,
  alreadyInDB,
  registerUser,
  getObjectById,
  addObject,
  loanObject,
  returnItem
};

