/**
 * A helper class containing methods pertaining to users
 */

const bcrypt = require('bcrypt');

const saltAmnt = 10;

/**
 * A helper function to hash a given password using bcrypt
 * @param {string} password is the plain-text password to be hashed
 * @return {Promise<string>} a promise which on success has the hashed password.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, saltAmnt);
}
/**
 * Wrapper function for bcrypt's compare to return true if a password matches a given hash.
 * @param {string} password the plain-text password to hash.
 * @param {string} hashed is the hashed string from the db to compare to.
 * @return {Promise<boolean>} the promise resulting from bcrypt's compare with our password and hash
 */
function checkPassword(password, hashed) {
  bcrypt.compare(password, hashed);
}
module.exports = {
  hashPassword,
  checkPassword,
};
