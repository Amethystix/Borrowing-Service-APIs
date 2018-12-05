const express = require('express');

const router = express.Router();

/** Unfinished
 * Returns some of the most recent transactions for the feed
 */
router.get('/feed', (req, res, next) => {
  console.log(req, res, next);
});

/** Unfinished
 * Search based on query criteria
 * If no params supplied, gives in chronological order
 */
router.get('/search', (req, res, next) => {
  let results = [];
  console.log(res, next);

  // take in query parameters: item name, zip, username, name

  if (req.query.itemName) {
    // search for item name with given string
    if (results.length <= 0) {
      // get from database
    } else {
      // filter by results
      results = results.filter(val => val.itemName.toLowerCase()
        .includes(req.query.itemName.toLowerCase()));
    }
  }

  if (req.query.zipcode) {
    if (results.length <= 0) {
      // get from database
    } else {
      // filter by results
      results = results.filter(val => val.zipcode.equals(req.query.zipcode));
    }
  }

  if (req.query.username) {
    if (results.length <= 0) {
      // get from database
    } else {
      // filter by results
      results = results.filter(val => val.username.toLowerCase()
        .includes(req.query.username.toLowerCase()));
    }
  }

  if (req.query.name) {
    if (results.length <= 0) {
      // get from database
    } else {
      // filter by results
      results = results.filter(val => (val.firstName.toLowerCase()
        .includes(req.query.name.toLowerCase())
          || val.lastName.toLowerCase()
            .includes(req.query.name.toLowerCase())
          || (req.query.name.toLowerCase()
            .includes(val.lastName.toLowerCase())
            && req.query.name.toLowerCase()
              .includes(val.firstName.toLowerCase()))));
    }
  }
});
