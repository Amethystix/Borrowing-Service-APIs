const mysql = require('mysql');
const fs = require('fs');
const Promise = require('promise');
const mapreduce = require('mapred')();

const dbConfig = require('../dbconfig');

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASS,
  database: dbConfig.DB,
});

/* eslint-disable */


// Map function
const map = function (key, value) {
  const list = [];
  const aux = {};

  aux[key] = value;

  for (const k in aux) {
    list.push([k, aux[k]]);
  }

  return list;
};

// Reducer function
const reduce = function (key, values) {
  let sum = 0;
  let count = 0;

  values.forEach((e) => {
    sum += e;
    count++;
  });

  return sum / count;
};


setInterval(function() {
  
  //First reads the data from database
  const firstPromise = new Promise(((fulfill, reject) => {

    const information = [];

    connection.query('SELECT * FROM review', (error, rows, fields) => {
      if (error) {
        reject("Problem reading from the database to perform MapReduce.");
      } 

      else {
        rows.forEach((element) => {
          information.push([element.userId, element.rating]);
        });
      }

      console.log("Data pulled from database.");
      fulfill(information);
    });

  }));

  // Performs MapReduce job and send the data to be written into a file
  const secondPromise = firstPromise.then(list => new Promise(((fulfill, reject) => {

    mapreduce(list, map, reduce, (result) => {

      if (result.length === 0) {
        reject("MapReduce operation failed");
      } 

      else {
        console.log("Mapreduce performed.");
        fulfill(result);
      }

    });
  })));

  //Third promise writes to output.json file to be read by front-end
  const thirdPromise = secondPromise.then(data => new Promise(((fulfill, reject) => {

    fs.writeFile('output.json', JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        reject("Problem writing MapReduce results to file.");
      } 

      else
        fulfill('The data processing results have been written to output.json.');
    });

  })));

  //Fourth promise reads from the file and updates the user table in the database
  const fourthPromise = thirdPromise.then((data) => new Promise(((fulfill, reject) => {
    
    console.log(data);

    //Reads from the file
    var obj = JSON.parse(fs.readFileSync('output.json', 'utf8'));

    //template sql query
    const sql = `UPDATE user
                SET averageReview = ?
                WHERE userId = ?`;

    //updates the database for every user
    for (var property in obj) {
      var newData = [obj[property], property];

      connection.query(sql, newData,  function(err, res){
        if(err)
          reject("Problem updating the database with new MapReduce results.");
      });
    }

    fulfill("User table in the database has been updated with updated average reviews at ");
  })));

  fourthPromise.then(data => {
    var d = new Date();
    console.log(data + ' --- ' + d + '\n\n');
  });

  firstPromise.catch((val) => {
    console.log({ 'Problem connecting the Database': val });
  });

  secondPromise.catch((val) => {
    console.log({ 'Problem performing MapReduce': val });
  });

  thirdPromise.catch((val) => {
    console.log({ 'Problem writing MapReduce results to the file': val });
  });

  fourthPromise.catch((val) => {
    console.log({ 'Problem performing MapReduce': val });
  });


}, 1800000); 
