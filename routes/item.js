const express = require('express');

const router = express.Router();

router.get('/view', (req, res, next) => {
  console.log(req, res, next);
});
router.post('/add', (req, res, next) => {
  console.log(req, res, next);
});

router.post('/borrow', (req, res, next) => {
  console.log(req, res, next);
});

router.delete('/delete', (req, res, next) => {
  console.log(req, res, next);
});
