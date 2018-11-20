/**
 * A class containing helper methods pertaining to errors.
 */

/**
 * A method that returns an error object with a certain status and message field.
 * @param {number} status the HTTP status code of the error
 * @param {string} message the descriptive message of the errror
 */
function makeError(status, message) {
  const err = new Error();
  err.status = status;
  err.body = { message };
  return err;
}

module.exports = {
  makeError,
};
