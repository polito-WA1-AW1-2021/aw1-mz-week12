'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const examDao = require('./exam-dao'); // module for accessing the exams in the DB
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const session = require('express-session');
const userDao = require('./user-dao');

/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => { 
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
  
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => { 
  userDao.getUserById(id).then((user) => {
    done(null, user); // req.user
  })
  .catch((err) => {
    done(err, null);
  });
});

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({error: 'Not authorized'});
}

// enable sessions in Express
app.use(session({
  // set up here express-session
  secret: 'una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

// init Passport to use sessions
app.use(passport.initialize()); 
app.use(passport.session());

/*** Courses/Exams APIs ***/

// GET /api/courses
app.get('/api/courses', (req, res) => {
  examDao.listCourses()
    .then(courses => res.json(courses))
    .catch(() => res.status(500).end());
});

// GET /api/exams
app.get('/api/exams', isLoggedIn, async (req, res) => {
  try {
    const exams = await examDao.listExams(req.user.id);
    res.json(exams);
  } catch(err) {
    res.status(500).end();
  }
  
});

/*** User APIs ***/
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error: 'Not authenticated'});
})

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});