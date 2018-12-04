const express = require('express');
const router = express.Router();


router.get('/feed', (req, res, next) => {

});

router.get('/search', (req, res, next) => {
	const results = [];

	/*
	* take in query parameters: item name, zip, username, first name, last name
	*/
	if(req.query.itemName){
		//search for item name with given string
		if(results.length <= 0){
			//get from database
		}
		else{
			//filter by results
			results = results.filter((val) => {
				return val.itemName.toLowerCase().includes(req.query.itemName.toLowerCase());
			}
		}
	}

	if(req.query.zipcode){
		if(results.length <= 0){
			//get from database
		}
		else{
			//filter by results
      results = results.filter((val) => {
        return val.zipcode.equals(req.query.zipcode);
      }
		}
	}

	if(req.query.username){
		if(results.length <= 0){
			//get from database
		}
		else{
			//filter by results
      results = results.filter((val) => {
        return val.username.toLowerCase().includes(req.query.username.toLowerCase());
      }
		}
	}

	if(req.query.firstName){
		if(results.length <= 0){
			//get from database
		}
		else{
			//filter by results
      results = results.filter((val) => {
        return val.firstName.toLowerCase().includes(req.query.firstName.toLowerCase());
      }
		}
	}

	if(req.query.lastName){
		if(results.length <= 0){
			//get from database
		}
		else{
			//filter by results
      results = results.filter((val) => {
        return val.lastName.toLowerCase().includes(req.query.lastName.toLowerCase()); 
      }
		}
	}

});
