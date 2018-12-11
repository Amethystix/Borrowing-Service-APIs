const express = require('express');
const fs = require("fs");
const router = express.Router();


// GET route which will return JSON object containg {user: review} pairs
router.get('/mapReduceReviews', (req, res, next) => {
  var output = fs.readFileSync('/output.json', 'utf-8');
  res.json(output);
  next();
});



module.exports = router;