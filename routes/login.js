var express = require('express');
var passport=require('passport');
var bcryptjs=require('bcryptjs');
var session = require('express-session');
var router = express.Router();

var User = require('../models/user');

router.get('/login', (req, res, next) => {
  User.find({},(err, user) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      User.count({role:"adminP"},(err,c) => {
        if (err) {
          console.log(err);
        }else {
          if(c==0){
            var user = new User(
              {
                prenom:"adminP",
                nom:"adminP",
                email: "voyage@gmail.com",
                role:"adminP",
                tel:"93 242 036",
                adresse:"19 rue allyssa carthage byrsa",
                password:"admin",
              }
            );
            bcryptjs.genSalt(12,(err, salt) => {
              bcryptjs.hash(user.password, salt,(err, hash) => {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    user.password=hash;
                    user.save((err) => {
                      if (err) {
                        console.log(err);
                        if (err.code == 11000 ) {
                          res.json({ message : 'user already exists' });
                        }
                        else {
                          res.send(err);
                        }
                      }
                    });
                  }
              });
          });
          }

        }
      });
    }
  });
    if(req.isAuthenticated()){
      res.redirect('/admin/index');
    }
    else{
      let error_msg=req.flash('error')[0];
      res.locals.error_msg=error_msg;
      res.render('login.html', { title: 'Login' });
    }
    
  });

  router.post('/login',(req,res,next) => {

    passport.authenticate('local',
      {
        session: true,
        successRedirect:'/admin/index',
        failureRedirect:'/login',   
        failureFlash : true     
      }
    )(req,res,next);
  });

  module.exports = router;
