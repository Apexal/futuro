const express = require('express');
const router = express.Router();
const moment = require('moment');

router.get('/', (req, res, next) => {
  const startDateString = req.query.start;
  const endDateString = req.query.end;
  if(!startDateString || !endDateString || !moment(startDateString, 'YYYY-MM-DD', true).isValid() || !moment(endDateString, 'YYYY-MM-DD', true).isValid())
      return res.json({ err: 'Invalid start date or end date.' });
  
  const start = moment(startDateString, 'YYYY-MM-DD', true);
  const end = moment(endDateString, 'YYYY-MM-DD', true);

  req.db.Rating.find({ date: { '$gte': start.toDate(), '$lt': end.toDate() } })
    .lean()
    .exec()
    .then(ratings => {
      return res.json({ ratings });
    }).catch(next);
});

router.get('/:date', (req, res, next) => {
  const dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  
  req.db.Rating.findOne({ date: date })
    .lean()
    .exec()
    .then((rating) => {
      res.json({rating});
    }).catch(next);
});

router.post('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
  const rating = req.body.rating;
  if(!rating.value) {
    req.db.Rating.findOne({ date: date }).remove().exec().then(() => {
      res.json({ success: true });
    }).catch(next);
  } else {
    req.db.Rating.findOne({ date: date }).exec().then((r) => {
      if(!r) {
        const newRating = new req.db.Rating({ date: date, value: rating.value });
        newRating.save((err) => {
          if(err) return next(err);
          return res.json({ rating: newRating });
        });
      } else {
        r.value = rating.value;
        r.save((err) => {
          if(err) return next(err);
          return res.json({ rating: r });
        });
      }
    });
  }
});

module.exports = router;
