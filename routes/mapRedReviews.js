const express = require('express');
const mysql = require('mysql');
const Promise = require('promise');
const dbConfig = require('../dbconfig.js');

const router = express.Router();
const mapreduce = require('mapred')();

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASS,
  database: dbConfig.DB,
});

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

  values.forEach((e) => {
    sum += e;
  });

  return sum / 5;
};

// GET route which will return JSON object containg {user: review} pairs
router.get('/mapReduceReviews', (req, res, next) => {
  const information = [];

  // Uses promises to first get data from the database and then performs MapRreduce jobs
  const firstPromise = new Promise(((fulfill, reject) => {
    connection.query('SELECT * FROM review', (error, rows, fields) => {
		  	if (error) { throw error; } else {
        rows.forEach((element) => {
          information.push([element.userId, element.rating]);
        });
      }

      fulfill(information);
    });
  }));

  // Performs MapReduce job
  firstPromise.then((data) => {
    mapreduce(data, map, reduce, (result) => {
      res.json(result);
      next();
    });
  });
});

module.exports = router;
