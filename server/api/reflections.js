const express = require('express');
const router = express.Router();
const moment = require('moment');


/* GET all activities */
router.get('/events', (req, res, next) => {
  const startDateString = req.query.start;
  const endDateString = req.query.end;
  if(!startDateString || !endDateString || !moment(startDateString, 'YYYY-MM-DD', true).isValid() || !moment(endDateString, 'YYYY-MM-DD', true).isValid())
      return res.json({ err: 'Invalid start date or end date.' });
  
  const start = moment(startDateString, 'YYYY-MM-DD', true);
  const end = moment(endDateString, 'YYYY-MM-DD', true);
  
  req.db.Reflection.find({ date: { '$gte': start.toDate(), '$lt': end.toDate() } })
    .lean()
    .exec()
    .then((reflections) => {
      const events = reflections.map((r) => {
        return {
          title: 'Daily Reflection',
          start: moment(r.date),
          color: 'red',
          allDay: true,
          url: `#/days/${moment(r.date).format('YYYY-MM-DD')}`
        };
      });

      res.json(events);
    }).catch(next);
});

router.get('/:date', (req, res, next) => {
  const dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  
  req.db.Reflection.findOne({ date: date })
    .lean()
    .exec()
    .then((reflection) => {
      res.json({reflection});
    }).catch(next);
});

router.post('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
  const reflection = req.body.reflection;
  if(!reflection.description) {
    req.db.Reflection.findOne({ date: date }).remove().exec().then(() => {
      res.json({ success: true });
    }).catch(next);
  } else {
    req.db.Reflection.findOne({ date: date }).exec().then((r) => {
      if(!r) {
        const newReflection = new req.db.Reflection({ date: date, description: reflection.description });
        newReflection.save((err) => {
          if(err) return next(err);
          return res.json({ reflection: newReflection });
        });
      } else {
        r.description = reflection.description.trim();
        r.save((err) => {
          if(err) return next(err);
          return res.json({ reflection: r });
        });
      }
    });
  }
});

module.exports = router;
