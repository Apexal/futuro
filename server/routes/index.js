const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  //new req.db.Activity({ id: 2, description: 'Make this website!', value: 1, date: new Date() }).save();
  res.render('index');
});

module.exports = router;
