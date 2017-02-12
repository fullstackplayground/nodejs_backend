var express = require('express');
var passport = require('passport');
var router = express.Router();
var DeliveryAddress = require('../models/deliveryaddress');
var js2xmlparser = require("js2xmlparser");

var data = {
    "firstName": "John",
    "lastName": "Smith"
};



router.get('/', function(req, res, next) {
  res.render('index', { xmlData: js2xmlparser.parse("person", data) });
  // res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

//database operation
//create or update
router.post('/deliveryaddress', isLoggedIn, function(req, res) {

  if(req.body.delete){
    res.redirect('addressremove/?user=' + req.body.user);
  } else {
     var data = req.body;
      data.updated_at = new Date();
      for( var key in data) {
        if(data[key].length == 0 || data[key] == undefined || data[key] == null) {
          res.redirect('/profile');
        }
      }
      DeliveryAddress.findOneAndUpdate(
      { user : data.user },
        data,
      { upsert: true }, function(error, result) {
        if (!error) {
              // If the document doesn't exist
              if (!result) {
                  // Create it
                  result = new DeliveryAddress();
                  result.updateAndSave(data);
              }
              // Save the document
              result.save(function(error) {
                  if (!error) {
                      console.log("successfully created new data!")
                      // Do something with the document
                  } else {
                      throw error;
                  }
              });
          }
        }
      )

      res.render('deliveryaddressconfirm.ejs', { user: req.user });
  }

});


//find 
router.get('/deliveryaddress', isLoggedIn, function(req, res) {

  DeliveryAddress.find({ user: req.query.user }, function(err, user) {
  if (err) throw err;
  res.render('deliveryaddressinfo', {user: user[0]})
});

})

//delete
router.get('/addressremove', isLoggedIn, function(req, res) {
    DeliveryAddress.findOneAndRemove({ user: req.query.user }, function(err, user) {
    if (err) throw err;
      res.render('addressremove')
     });
})


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
