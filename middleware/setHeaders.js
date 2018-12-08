

module.exports = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Cache-Control,Content-Type,Authorization');
  next();
};
