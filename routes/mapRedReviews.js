const express = require('express');
var mysql = require('mysql');
var Promise = require('promise');
const dbConfig = require('../dbConfig.js');
const router = express.Router();
var mapreduce = require('mapred')();

var connection = mysql.createConnection({
	host: dbConfig.HOST,
	port: dbConfig.PORT,
	user: dbConfig.USER,
	password: dbConfig.PASS,
	database: dbConfig.DB
});
 
//Map function
var map = function(key, value){
    var list = [];
    var aux = {};

    aux[key] = value;	

    for(var k in aux){
        list.push([k, aux[k]]);
    }

    return list;
};

//Reducer function
var reduce = function(key, values){
    var sum = 0;
    
    values.forEach(function(e){
        sum += e;
    });

    return sum/5;
};

//GET route which will return JSON object containg {user: review} pairs
router.get('/mapReduceReviews', (req, res, next) => {
	var information = [];

	//Uses promises to first get data from the database and then performs MapRreduce jobs
	const firstPromise = new Promise(function(fulfill, reject) { 
		connection.query('SELECT * FROM review', function(error, rows, fields) {
		  	if (error) 
		  		throw error;
		  	
		  	else	
			  	rows.forEach(function(element) {
					information.push([element.userId, element.rating]);
				});

			fulfill(information);
		});
	});

	//Performs MapReduce job
	firstPromise.then(function(data) {
		mapreduce(data, map, reduce, function(result){
			res.send(JSON.stringify(result));
			next();
		});
	});
});

module.exports = router;