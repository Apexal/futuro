const express = require('express');
const router = express.Router();
const moment = require('moment');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('days');
});

router.get('/:date', (req, res, next) => {
  const dateString = res.locals.dateString = req.params.date;
  
  res.locals.isToday = (dateString == moment().format("YYYY-MM-DD"));

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = res.locals.date = moment(dateString, 'YYYY-MM-DD', true);
  res.locals.pageTitle = date.format('');
  
  res.render('day');
});


module.exports = router;
