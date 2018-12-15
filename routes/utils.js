const express = require('express');
const conHelper = require('../helpers/connectionHelper');

const router = express.Router();

/** Unfinished
 * Returns some of the most recent transactions for the feed
 */
router.get('/feed', (req, res, next) => {
  conHelper.getFeed().then((results) => {
    if (results) {
      return res.status(200).json(results);
    }

    return (400).json({ message: 'Nothing in the feed' });
  }).catch((err) => { next(err); });
});

/**
 * Search based on query criteria
 * If no params supplied, gives in chronological order
 */
router.get('/search', (req, res, next) => {
  let results = [];

  // take in query parameters: item name, zip, username, name

  if (req.query.itemName) {
    // search for item name with given string
    conHelper.getObjectByItemName(req.query.itemName)
      .then((success) => {
        results = success.map(item => ({
          objectId: item.objectId,
          name: item.name,
          ownerId: item.ownerId,
          ownerUsername: item.ownerUsername,
          description: item.description,
          zipCode: item.zipCode,
          isReserved: item.isReserved,
        }));
        res.status(200).json(results);
        next();
      }).catch((err) => {
        next(err);
      });
  }
  else if (req.query.zipCode) {
    // get from database
    conHelper.getObjectByZipcode(req.query.zipCode)
      .then((success) => {
        results = success.map(item => ({
          objectId: item.objectId,
          name: item.name,
          ownerId: item.ownerId,
          ownerUsername: item.ownerUsername,
          description: item.description,
          zipCode: item.zipCode,
          isReserved: item.isReserved,
        }));
        res.status(200).json(results);
        next();
      }).catch((err) => {
        next(err);
      });
  }
  else if (req.query.username) {
    // get from database
    conHelper.getUserListed(req.query.username)
      .then((success) => {
        results = success.map(item => ({
          objectId: item.objectId,
          name: item.name,
          ownerId: item.ownerId,
          ownerUsername: item.ownerUsername,
          description: item.description,
          zipCode: item.zipCode,
          isReserved: item.isReserved,
        }));
        res.status(200).json(results);
        next();
      }).catch((err) => {
        next(err);
      });
  }

  else if (req.query.name) {
    // get from database
    conHelper.getObjectByOwnerName(req.query.name)
      .then((success) => {
        results = success.map(item => ({
          objectId: item.objectId,
          name: item.name,
          ownerId: item.ownerId,
          ownerUsername: item.ownerUsername,
          description: item.description,
          zipCode: item.zipCode,
          isReserved: item.isReserved,
        }));
        res.status(200).json(results);
        next();
      }).catch((err) => {
        next(err);
      });
  } else {
    conHelper.getObjectByItemName('')
      .then((success) => {
        results = success.map(item => ({
          objectId: item.objectId,
          name: item.name,
          ownerId: item.ownerId,
          ownerUsername: item.ownerUsername,
          description: item.description,
          zipCode: item.zipCode,
          isReserved: item.isReserved,
        }));
        res.status(200).json(results);
        next();
      }).catch((err) => {
        next(err);
      });
  }
});

module.exports = router;
