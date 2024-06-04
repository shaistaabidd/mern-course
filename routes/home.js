const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  // res.send('Hello Express!!!');
  res.render('index', {title: 'Page title Pug', message: 'Hello Express'});
});
module.exports = router;