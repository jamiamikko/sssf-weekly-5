const express = require('express');
const router = express.Router();
const indexContent = require('../views/index.json');
const loginContent = require('../views/login.json');

router.get('/', (req, res) => {
  // if (req.user) {
    return res.render('index', {
      title: 'Assignment 5',
      // username: req.user.username,
      content: indexContent
    });
  // }

  // res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login', content: loginContent});
});

module.exports = router;
