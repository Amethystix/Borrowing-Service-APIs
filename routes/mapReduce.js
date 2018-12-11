const express = require('express');
const fs = require('fs');

const router = express.Router();


// GET route which will return JSON object containg {user: review} pairs
router.get('/map-reduce', (req, res, next) => {
  const output = fs.readFileSync('output.json', 'utf-8');
  res.json(JSON.parse(output));
  next();
});


module.exports = router;
