const express = require('express');

const router = express.Router();
const uuidv1 = require('uuid/v1');
const userHelper = require('../helpers/userHelper');
const { makeError } = require('../helpers/errorHelper');

router.post('/register', (req, res, next) => {
  const {
    username, password, confirmPassword, email, firstName, lastName,
  } = req.body;
  if (username && password && confirmPassword && email && firstName && lastName) {
    if (password === confirmPassword) {
      // if(username exists in the db || email exists in the db) {
      //   const err = new Error();
      //   err.status = 409;
      //   err.body = {
      //     message: 'There already exists a user with this name or email',
      //   };
      //   res.status(409).json(err);
      // }
      // else do the following to register the user
      const userObj = {
        username,
        email,
        firstName,
        lastName,
        uuid: uuidv1(),
      };
      userHelper.hashPassword(password).then((encrypted) => {
        userObj.password = encrypted;
        // Add userObj to the database
        res.status(201).json(userObj);
      }).catch(err => next(err));
    } else {
      const err = makeError(403, 'Passwords do not match');
      res.status(403).json(err);
    }
  } else {
    let err;
    if (!username) {
      err = makeError(422, 'Username field must be present');
    } else if (!email) {
      err = makeError(422, 'Email field must be present');
    } else if (!password || !confirmPassword) {
      err = makeError(422, 'Both password fields must be present');
    } else if (!firstName) {
      err = makeError(422, 'First name must be present');
    } else if (!lastName) {
      err = makeError(422, 'Last name must be present');
    } else {
      err = makeError(422, 'Unprocessable entity');
    }
    res.status(422).json(err);
  }
});

router.post('/login', (req, res, next) => {
  // TODO: add optional rememberMe to extend session time
  const { username, password } = req.body;
  if (username && password) {
    if (username === 'exists in the db (placeholder)') {
      const hashed = 'Placeholder, should be the pass hash we get from the db';
      userHelper.checkPassword(password, hashed)
        .then((result) => {
          if (result) {
            // Log in that user!
            res.json({ loggedIn: 'User is logged in' });
          } else {
            res.status(401).json(makeError(401, 'Incorrect credentials'));
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      // User does not exist in the db
      res.status(401).json(makeError(401, 'Incorrect credentials'));
    }
  } else {
    let err;
    if (!username) {
      err = makeError(422, 'Username field is required');
    } else {
      err = makeError(422, 'Password field is required');
    }
    res.status(422).json(err);
  }
});

module.exports = router;
