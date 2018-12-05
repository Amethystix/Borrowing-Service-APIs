const express = require('express');

const router = express.Router();
const uuidv1 = require('uuid/v1');
const userHelper = require('../helpers/userHelper');
const { makeError } = require('../helpers/errorHelper');
const connectionHelper = require('../helpers/connectionHelper');

router.post('/register', (req, res, next) => {
  // console.log(req.body);

  const {
    username, password, confirmPassword, email, firstName, lastName,
  } = req.body;


  if (username && password && confirmPassword && email && firstName && lastName) {
    if (password === confirmPassword) {
      connectionHelper.alreadyInDB(username, email).then((results) => {
        // I will try to clean this at a later date but it's working that's matter
        if (results.length > 0) {
          const err = new Error();
          err.status = 409;
          err.body = {
            message: 'There already exists a user with this name or email',
          };
          res.status(409).json(err);
          next();
        } else {
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
            connectionHelper.registerUser(userObj)
              .then()
              .catch(err => next(err));

            res.status(201).json(userObj);
            next();
          }).catch(err => next(err));
        }
      }).catch((err) => { // catch for entering into database
        next(err);
      });
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
    next();
  }
});

router.post('/login', (req, res, next) => {
  // TODO: add optional rememberMe to extend session time
  const { username, password } = req.body;
  if (username && password) {
    // console.log(connectionHelper.findUser(username));

    connectionHelper.findUser(username).then((result) => {
      // console.log(result)
      if (result.length !== 1) {
        res.status(422).json(makeError(422, 'User not found'));
        next();
      } else {
        const user = result[0];
        const hashed = user.password;

        userHelper.checkPassword(password, hashed).then((success) => {
          if (success) {
            // Log in that user!
            res.status(200).json({ loggedIn: 'User is logged in', userObj: user });
            next();
          } else {
            res.status(401).json(makeError(401, 'Incorrect credentials'));
            next();
          }
        }).catch((err) => {
          next(err);
        });
      }
    }).catch((err) => {
      res.status(500).json(makeError(500, 'Database Error'));
      next(err);
    });
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
