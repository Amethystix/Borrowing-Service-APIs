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


// First reads the data from database
const firstPromise = new Promise(((fulfill, reject) => {
  const information = [];
  connection.query('SELECT * FROM review', (error, rows, fields) => {
    if (error) {
      reject(error);
    } else {
      rows.forEach((element) => {
        information.push([element.userId, element.rating]);
      });
    }

    fulfill(information);
  });
}));

// Performs MapReduce job and returns the result as a JSON
const secondPromise = firstPromise.then(list => new Promise(((fulfill, reject) => {
  mapreduce(list, map, reduce, (result) => {
    if (result.length === 0) {
      reject(true);
    } else {
      fulfill(result);
    }
  });
})));

// Writes to a file to be read later
secondPromise.then((data) => {
  fs.writeFile('output.json', JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      console.log(err);
    }

    console.log('The data processing has finished.');
    process.exit();
  });
});


firstPromise.catch((val) => {
  console.log({ 'Problem connecting the Database': val });
});

secondPromise.catch((val) => {
  console.log({ 'Problem performing MapReduce': val });
});
