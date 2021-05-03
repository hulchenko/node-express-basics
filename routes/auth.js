const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = Router();
const { validationResult } = require('express-validator/check');
const { registerValidators } = require('../utils/validators');
const User = require('../models/user');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      // simple non-encrypted password check
      // const areSame = password === candidate.password;
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect('/');
        });
      } else {
        req.flash('loginError', 'Incorrect Password');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', "User doesn't exist");
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body;
    const candidate = await User.findOne({ email });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register'); //display error to user and redirect back to login section
    }

    if (candidate) {
      req.flash('registerError', 'Email Already in Use.');
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10); //new user password will be hashed with the salt length of 10
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
