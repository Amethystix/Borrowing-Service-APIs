const express = require('express');

const router = express.Router();
const uuidv1 = require('uuid/v1');
const userHelper = require('../helpers/userHelper');
const { makeError } = require('../helpers/errorHelper');
const connectionHelper = require('../helpers/connectionHelper');
const { makeToken, checkToken, getUserFromToken } = require('../helpers/tokenHelper');

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
          const err = makeError(409, 'There already exists a user with this name or email');
          res.status(409).json(err);
          next();
        } else {
          const uuid = uuidv1();
          const userObj = {
            username,
            email,
            firstName,
            lastName,
            uuid,
          };

          userHelper.hashPassword(password).then((encrypted) => {
            userObj.password = encrypted;
            // Add userObj to the database
            connectionHelper.registerUser(userObj)
              .then()
              .catch(err => next(err));
            // TODO: implement rememberMe on front and backend
            const token = makeToken(userObj, false);
            const payload = {
              username,
              firstName,
              lastName,
              uuid,
            };
            res.status(201).json({ token, userObj: payload });
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
    connectionHelper.findUser(username).then((result) => {
      if (result.length !== 1) {
        res.status(401).json(makeError(401, 'User not found'));
        next();
      } else {
        const user = result[0];
        const hashed = user.password;
        userHelper.checkPassword(password, hashed).then((success) => {
          if (success) {
            // Log in that user!
            const userObj = {
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              userId: user.userId,
            };
            const token = makeToken(user, false);
            res.status(200).json({ success: true, token, userObj });
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


router.get('/borrowed', (req, res, next) => {
  const user = getUserFromToken(req.headers.authorization);

  connectionHelper.getUserBorrowed(user.userId).then((results) => {
    if (results) {
      res.status(200).json(results);
      next();
    } else {
      res.status(400).json({ message: 'User has no borrowed items' });
      next();
    }
  }).catch((err) => { next(err); });
});

router.get('/listed', (req, res, next) => {
  const user = getUserFromToken(req.headers.authorization);

  connectionHelper.getUserListed(user.userId).then((results) => {
    if (results) {
      res.status(200).json(results);
      next();
    } else {
      res.status(400).json({ message: 'User has no listed items' });
      next();
    }
  }).catch((err) => { next(err); });
});

router.post('/review', (req, res, next)=>{
  const username = req.body.username;
  const rating = req.body.rating;

  connectionHelper.addRating(username, rating).then((results)=>{
    if (results){
      res.status(200).json({'user':username, 'rate':rating});
      next();
    }
    else{
      res.status(500).json('database Error');
      next();
    }
  }).catch((err)=>{next(err);})
});

router.get('/view', (req, res, next)=>{
  const userId = req.query.userId;

  connectionHelper.getUserListed(userId).then((results)=>{
    if (results.length > 0){
      const username = results[0].ownerUsername

      const objects = results.map((obj)=>{
        return { objectId: obj.objectId,
          objectName: obj.name,
          description: obj.description,
          pictureURL: obj.pictureURL,
          zipCode: obj.zipCode,
          isReserved: obj.isReserved,}
        });

      res.status(200).json({'username': username, "listedObjects": objects})
    } else {
      res.status(500).json({'message': 'User has no objects'});
    }

  }).catch((err)=>{next(err);})

});

router.get('/auth', (req, res) => {
  if (req.headers.authorization) {
    if (checkToken(req.headers.authorization)) {
      res.status(200).json({ success: true });
    } else {
      res.status(403).json(makeError(403, 'Invalid token'));
    }
  } else {
    res.status(403).json(makeError(403, 'Auth header not present'));
  }
});



module.exports = router;
