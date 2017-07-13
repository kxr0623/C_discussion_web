var express = require('express');
var router = express.Router();
const DbQuery = require('./dbconnector')


router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  DbQuery()
        .then((text) => res.send(text))//sent the data from db to page
        .catch((err) => console.log(err))//else catch an err
});
router.get('/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route (index.pug)
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.render('single')
})

// handler for the /user/:id path, which renders a special page
router.get('/:id', function (req, res, next) {
  res.render('single')
})

module.exports = router;
