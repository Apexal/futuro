const express = require('express');
const router = express.Router();
const moment = require('moment');

router.get('/', (req, res, next) => {
  req.db.Person.find({ })
    .lean()
    .exec()
    .then(people => {
      return res.json({ people });
    }).catch((err) => {
      return res.json({ err: err });
    });
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;

  req.db.Person.findOne({ 'name.unique': name })
    .lean()
    .exec()
    .then((person) => {
      res.json({person});
    }).catch((err) => {
      return res.json({ err: err });
    });
});

module.exports = router;
