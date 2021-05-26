'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const examDao = require('./exam-dao'); // module for accessing the exams in the DB

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

/*** Courses/Exams APIs ***/

// GET /api/courses
app.get('/api/courses', (req, res) => {
  examDao.listCourses()
    .then(courses => res.json(courses))
    .catch(() => res.status(500).end());
});

// GET /api/exams
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await examDao.listExams();
    res.json(exams);
  } catch(err) {
    res.status(500).end();
  }
});

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});