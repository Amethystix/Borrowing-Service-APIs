const mysql = require('mysql');
const conf = require('../dbconfig');



//results are returned as an array of objects with column names as the keys
//TODO:can also add timeout to the query options


function findUser(username){

	const con = mysql.createConnection({
		host: conf.HOST
		,user: conf.USER
		,password: conf.PASS
		,database: conf.DB
	});

	let SQL = 'SELECT * FROM user WHERE username = ?';

	return new Promise((resolve, reject)=>{
		con.query(SQL, [username], (err, result)=>{

			if (err) reject(err);
			
			//console.log(result);
			resolve(result);

			con.end();

		});
	});

}


function alreadyInDB(username, email){
	const con = mysql.createConnection({
		host: conf.HOST
		,user: conf.USER
		,password: conf.PASS
		,database: conf.DB
	});
	// let user = null;


	let SQL = "SELECT username, email FROM user WHERE username = ? OR email = ?"

	return new Promise((resolve, reject)=>{
		con.query(SQL, [username, email], (err, results)=>{
			//try putting the entire results into the resolve and error checking from there

			if (err) reject(err);

			resolve(results);

			con.end();
		});
	});

}

function registerUser(userObj){
	let SQL = 'INSERT INTO user (userId, email, username, password, firstName, lastName, joinedOn) VALUES (?, ?, ?, ?, ?, ?, curdate())'

	const con = mysql.createConnection({
		host: conf.HOST
		,user: conf.USER
		,password: conf.PASS
		,database: conf.DB
	});

	//console.log(userObj);
	return new Promise((resolve, reject)=>{

		con.query(SQL,[userObj.uuid, userObj.email, userObj.username, userObj.password, userObj.firstName, userObj.lastName]
			, (err, result)=>{
				if (err) reject(err);
				else
					resolve(result);

			});

		con.end()
	});

}	


function addObject(obj){
/*	objectId INT NOT NULL PRIMARY KEY
	,ownerId INT NOT NULL REFERENCES user(userId)
	,ownerName VARCHAR(255)
	,name VARCHAR(100)
	,picture VARCHAR(255) 
	,price DECIMAL(20, 4)
	,latitude DECIMAL(30, 15)
	,longitude DECIMAL(30, 15)
	,isReserved TINYINT*/

	let SQL = 'INSERT INTO object VALUES (?,?,?,?,?,?,?,?,0)'

}

function getObject(objectName){
	let SQL = "SELECT objectId"

}

function loanObject(objectId){
	//first find the object and get the name
}		


module.exports = {
	findUser: findUser
	,alreadyInDB:alreadyInDB
	,registerUser:registerUser
}