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
      let events = [];
      let days = {};

      activities.forEach((a) => {
        if(!days[a.date]) days[a.date] = [];
        days[a.date].push(a);
      });

      for(let date in days) {
        const dayAssignments = days[date];
        
        events.push({
          title: `${dayAssignments.length} activities`,
          start: moment(date),
          color: 'green',
          allDay: true,
          url: `#/days/${moment(date).format('YYYY-MM-DD')}`
        });
      }
      
      res.json(events);
    }).catch(next);
});

router.get('/:date', (req, res, next) => {
  const dateString = res.locals.dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid())
    return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  
  req.db.Activity.find({ date: date })
    .lean()
    .exec()
    .then(activities => {
      res.json(activities);
    }).catch(next);
});

router.put('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
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

  newActivity.save(err => {
    if(err) return next(err);
    return res.json(newActivity);
  });
});

router.delete('/:date', (req, res, next) => {
  // Take forever to validate the date query
  const dateString = res.locals.dateString = req.params.date;

  if(!moment(dateString, 'YYYY-MM-DD', true).isValid()) return next('Invalid date!');

  var date = moment(dateString, 'YYYY-MM-DD', true);
  // ----------------------- Finally done
  
  const activityId = req.body._id;

  if(!activityId) return next('Missing data!');

  req.db.Activity.findOne({ date: date, _id: activityId }).remove().exec().then(() => {
    res.json({ success: true });
  }).catch(next);
});

module.exports = router;
