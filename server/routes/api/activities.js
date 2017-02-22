const express = require('express');
const router = express.Router();

/* GET all activities */
router.get('/', (req, res, next) => {
  res.json([]);
});

module.exports = router;
