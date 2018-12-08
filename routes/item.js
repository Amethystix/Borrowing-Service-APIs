const express = require('express');
const uuidv1 = require('uuid/v1');
const { makeError } = require('../helpers/errorHelper');

const router = express.Router();

/** Unfinished
 * View an item's info by supplying its id as a query param
 */
router.get('/view', (req, res, next) => {
  if (req.query.id) {
    // Get item from db
    res.status(200).json(req.query.id);

    // if not found in db:
    // res.status(404).json(makeError(404, `Couldn't find the item with the id ${req.query.id}`));
  } else {
    // TODO: what to do in case of no query param?
    res.status(422).json(makeError(422, 'Id query param needed'));
    next();
  }
});

/** Unfinished
 * Add an item to be borrowed
 */
router.post('/add', (req, res, next) => {
  if (req.body.name && req.body.zipCode) {
    // TODO: Add image to google bucket and populate imageUrl
    const item = {
      name: req.body.name,
      location: req.body.zipCode,
      description: req.body.description ? req.body.description : '',
      imageUrl: '',
      itemId: uuidv1(),
    };
    // TODO: Add item to db
    res.status(200).json(item);
  } else if (!req.body.name) {
    res.status(422).json(makeError(422, 'Required field name missing'));
  } else if (!req.body.location) {
    res.status(422).json(makeError(422, 'Required field location missing'));
  }
  next();
});

/** Unfinished
 * Should accept an itemId and use the auth token to determine who is borrowing
 */
router.post('/borrow', (req, res, next) => {
  if (req.body.itemId) {
    // TODO: implement
  } else {
    res.status(422).json(makeError(422, 'Request expects an item id'));
    next();
  }
});

/** Unfinished
 * Request should send an item id to return
 */
router.post('/return', (req, res, next) => {
  if (req.body.itemId) {
    // TODO: implement returning
  } else {
    res.status(422).json(makeError(422, 'Request expects an item id'));
    next();
  }
});

/** Unfinished
 * Delete an item.
 */
router.delete('/delete', (req, res, next) => {
  console.log(req, res, next);
});

module.exports = router;
