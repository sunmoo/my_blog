//var express = require('express');
//var router = express.Router();

/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */
var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Home',
      user: req.session.user,
      success:req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/reg', function (req, res) {
    console.log('come here ');
    res.render('reg', {
      title: '注册',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
  app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];

    if(password_re != password) {
      req.flash('error', '两次输入的密码不一致!');
      return res.redirect('reg');
    }

    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name:name,
      password: password,
      email: req.body.email
    });

    //check the user exists
    User.get(newUser.name, function(err, user) {

      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if(user) {
        req.flash('error', '用户已存在!');
        return res.redirect('/reg');
      }

      newUser.save(function(err, user) {

        if(err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        req.flash('success', '注册成功!');
        res.redirect('/');
      });
    });
  });


  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });

  app.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    //check user exists
    User.get(req.body.name, function(err,user) {
      if(!user) {
        req.flash('error', "User doesn't exist");
        return res.redirect('/login');
      }

      if(user.password != password) {
        req.flash('error', 'The passport is wrong!');
        return res.redirect('/login');
      }

      req.session.user = user;
      req.flash('success', 'Login successfully');
      res.redirect('/');
    });
  });

  app.get('/post', function (req, res) {
    res.render('post', { title: '发表' });
  });
  app.post('/post', function (req, res) {
  });

  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', 'Logout successfully');
    res.redirect('/');
  });

};
