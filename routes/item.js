const express = require('express');
const uuidv1 = require('uuid/v1');
const { makeError } = require('../helpers/errorHelper');
const conHelper = require('../helpers/connectionHelper');
const { getUserFromToken } = require('../helpers/tokenHelper');


const router = express.Router();

/** Unfinished
 * View an item's info by supplying its id as a query param
 */
router.get('/view', (req, res, next) => {
  if (req.query.id) {
    // Get item from db
    conHelper.getObjectById(req.query.id).then((results) => {
      if (results.length === 1) {
        res.status(200).json(results[0]);
      } else {
        // if not found in db:
        res.status(404).json(makeError(404, `Couldn't find the item with the id ${req.query.id}`));
      }
    }).catch((err) => { next(err); });
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

    const currUser = getUserFromToken(req.headers.authorization);

    const item = {
      name: req.body.name,
      location: req.body.zipCode,
      description: req.body.description ? req.body.description : '',
      imageUrl: '',
      itemId: uuidv1(),
      ownerId: currUser.uuid,
      ownerUsername: currUser.username,
    };

    conHelper.addObject(item).then((results) => {
      if (results) {
        res.status(200).json({ id: item.itemId });
        next();
      } else {
        res.status(400).json(makeError(400, 'Database Error'));
        next();
      }
    }).catch((err) => {
      next(err);
    });
  } else if (!req.body.name) {
    res.status(422).json(makeError(422, 'Required field name missing'));
    next();
  } else if (!req.body.location) {
    res.status(422).json(makeError(422, 'Required field location missing'));
    next();
  }
});

/** Unfinished
 * Should accept an itemId and use the auth token to determine who is borrowing
 */
router.post('/borrow', (req, res, next) => {
  if (req.body.itemId) {
    const currUser = getUserFromToken(req.headers.authorization);

    conHelper.loanObject(req.body.itemId, currUser.userId, currUser.username).then(() => {
      res.status(200).json({ success: true });
      next();
    }).catch(err => next(err));
  } else {
    res.status(422).json(makeError(422, 'Request expects an item id'));
    next();
  }
});

/**
 * Request should send an item id to return,
 * will also use the auth token to determine who is returning it
 */
router.post('/return', (req, res, next) => {
  if (req.body.itemId) {
    // TODO: implement returning
    const currUser = getUserFromToken(req.headers.authorization);

    conHelper.returnItem(req.body.itemId, currUser.userId).then((results) => {
      if (results) {
        res.status(200).json(req.body.itemId);
      }
    }).catch(err => next(err));
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
