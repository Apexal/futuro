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
  
  req.db.Activity.find({ date: { '$gte': start.toDate(), '$lt': end.toDate() } })
    .lean()
    .exec()
    .then((activities) => {
      console.log(activities);
      const events = activities.map((a) => {
        let date = moment(a.date);

        let data =  {
          id: a.id,
          date: date,
          title: a.summary,
          url: `/days/${moment(a.date, true).format('YYYY-MM-DD')}`,
          classsName: `activity activity-${a.value}`
        };

        if(!!a.startTime && !!a.endTime) {
          const start = moment(a.startTime, 'hh:mm a');
          const end = moment(a.endTime, 'hh:mm a');

          if(start.isValid() && end.isValid()){
            start.set({ 'year': date.get('year'), 'month': date.get('month'), 'day': date.get('day') });
            end.set({ 'year': date.get('year'), 'month': date.get('month'), 'day': date.get('day') });
            
            data.start = start;
            data.end = end;
          }
        } else {
          data.allDay = true;
        }

        return data;
      });
      res.json(events);
    }).catch((err) => {
      console.error(err);
      return res.json({ err: err });
    });
});

router.get('/:date', (req, res, next) => {
  const dateString = res.locals.dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = res.locals.date = moment(dateString, 'YYYY-MM-DD', true);
  
  req.db.Reflection.findOne({ date: date })
    .lean()
    .exec()
    .then((reflection) => {
      res.json({reflection});
    }).catch((err) => {
      return res.json({ err: err });
    });
});

router.post('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = res.locals.dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
  const reflection = req.body.reflection;
  if(!reflection.description) {
    req.db.Reflection.findOne({ date: date }).remove().exec().then(() => {
      res.json({ success: true });
    }).catch((err) => {
      return res.json({ err: err });
    });
  } else {
    req.db.Reflection.findOne({ date: date }).exec().then((r) => {
      if(!r) {
        const newReflection = new req.db.Reflection({ date: date, description: reflection });
        newReflection.save((err) => {
          if(err) return next('Missing data!');
          return res.json({ reflection: newReflection });
        });
      } else {
        r.description = reflection.description.trim();
        r.save((err) => {
          if(err) return next('Missing data!');
          return res.json({ reflection: r });
        });
      }
    });
  }
});

module.exports = router;
