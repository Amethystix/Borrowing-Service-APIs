const mysql = require('mysql');
const fs = require('fs');
const Promise = require('promise');
const dbConfig = require('../../dbconfig.js');
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
  let count = 0;

  values.forEach((e) => {
    sum += e;
    count++;
  });

  return sum / count;
};


//First reads the data from database
const firstPromise = new Promise(((fulfill, reject) => {
  var information = [];
  connection.query('SELECT * FROM review', (error, rows, fields) => {     
    if (error) { 
      reject(error); 
    }

    else {
       rows.forEach((element) => {
       information.push([element.userId, element.rating]);
      });
    }

    fulfill(information);
  });
}));

// Performs MapReduce job and returns the result as a JSON
const secondPromise = firstPromise.then(function(list) {
  return new Promise(function(fulfill, reject) {
    mapreduce(list, map, reduce, function(result) { 
      if(result.length == 0)
        reject(true);
      else
        fulfill(result);
    });
  });
});

//Writes to a file to be read later
secondPromise.then(function(data) {
  console.log(data);
  fs.writeFileSync('output.json', JSON.stringify(data), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    else {
      console.log("The file was saved!");
      process.exit();
    }
  });
}); 


firstPromise.catch(function(val) {
  console.log({"Problem connecting the Database": val});
});

secondPromise.catch(function(val) {
  console.log({"Problem performing MapReduce": val});
});
