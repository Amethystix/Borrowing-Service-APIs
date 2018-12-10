const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const privateKEY = fs.readFileSync(path.join(__dirname, '../credentials/private.key'), 'utf8');
const publicKEY = fs.readFileSync(path.join(__dirname, '../credentials/public.key'), 'utf8');

// Creates a JWT token
function makeToken(user, rememberMe) {
  const {
    username, email, firstName, lastName, userId
  } = user;

  const payload = {
    username,
    email,
    firstName,
    lastName,
    userId,
  };

  let expiresIn;

  /**
   * Expire token in 24h with remember me false or undefined
   * If it is true, expire token in 1 year.  Currently rememberMe
   * is not implemented.
   */
  if (rememberMe) {
    expiresIn = '365d';
  } else {
    expiresIn = '24h';
  }

  const signOptions = {
    issuer: 'PalmTree',
    subject: username,
    audience: '',
    expiresIn,
    algorithm: 'RS256',
  };

  return jwt.sign(payload, privateKEY, signOptions);
}

// Check the token passed in by the client
function checkToken(token) {
  const subject = jwt.decode(token).username;
  const verifyOptions = {
    isser: 'PalmTree',
    subject,
    audience: '',
    expiresIn: '24h',
    algorithm: ['RS256'],
  };
  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (err) {
    return false;
  }
}

function getUserFromToken(token){
  return jwt.decode(token);
}

module.exports = {
  makeToken,
  checkToken,
  getUserFromToken
};
