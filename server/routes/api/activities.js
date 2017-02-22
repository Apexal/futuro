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
  
  res.locals.isToday = (dateString == moment().format("YYYY-MM-DD"));

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = res.locals.date = moment(dateString, 'YYYY-MM-DD', true);
  
  req.db.Activity.find({ date: date })
    .lean()
    .exec()
    .then((activities) => {
      console.log(activities);
      res.json(activities);
    }).catch((err) => {
      return res.json({ err: err });
    });
});

router.put('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = res.locals.dateString = req.params.date;
  
  res.locals.isToday = (dateString == moment().format("YYYY-MM-DD"));

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = res.locals.date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
   
  const summary = req.body.summary;
  const description = req.body.description;

  if(!summary) return next('Missing data!');

  let data = { date: date, summary: summary, description: description};
  if(!!req.body.startTime && !!req.body.endTime) {
    data.startTime = req.body.startTime;
    data.endTime = req.body.endTime;  
  }

  const newActivity = new req.db.Activity(data);

  newActivity.save((err) => {
    if(err) return next('Missing data!');
    return res.json(newActivity);
  });
});

router.delete('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = res.locals.dateString = req.params.date;
  
  res.locals.isToday = (dateString == moment().format("YYYY-MM-DD"));

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = res.locals.date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
  console.log(req.body);
  const activityId = req.body._id;

  if(!activityId) return next('Missing data!');

  req.db.Activity.findOne({ date: date, _id: activityId }).remove().exec().then(() => {
    res.json({ success: true });
  }).catch((err) => {
    return res.json({ err: err });
  });
});

module.exports = router;
