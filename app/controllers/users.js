
/**
 * Module dependencies.
 */
// module dependencies
var User = require('../models/user');

var mongoose   = require('mongoose')
  , User       = mongoose.model('User')
  , utils      = require('../helper/util')

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function (req, res) {
  if(req.isAuthenticated()){
    res.redirect('/dashboard')
  }else{
    res.render('users/login', {
      title: 'Login',
      message: req.flash('error')
    })
  }
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  if(req.isAuthenticated()){
    res.redirect('/dashboard')
  } else {
    res.render('users/signup', {
      title: 'Sign up',
      user: new User()
    })
  }
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = login

/**
 * Create user
 */

exports.create = function (req, res, next) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err, new_user) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      })
    } else {
      console.log(user)
      // manually login the user once successfully signed up
      req.logIn(user, function(err) {
        if (err) {
          console.log(err)
          return next(err)
        }
        return res.redirect('/dashboard')
      })
    }
  })
}

/**
 *  Show
 */

exports.show = function (req, res, next) {
  user = req.user
  console.log(user)
  res.render('users/show', {
    title: user.name,
    user: user
  })
}


/**
 *  Show profile
 */

exports.user_profile = function (req, res, next) {
  if(!req.user) {
    res.redirect('/')
  } else {

    user = req.user

    res.render('users/show', {
      title: user.name,
      user: user
    })
  }


}
