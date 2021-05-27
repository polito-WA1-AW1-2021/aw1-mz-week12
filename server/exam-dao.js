'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');

// get all courses
exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((e) => ({ code: e.code, name: e.name, CFU: e.CFU }));
      resolve(courses);
    });
  });
};

// get all exams
exports.listExams = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT coursecode, score, date FROM exam WHERE userId = ?';

    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const exams = rows.map((e) => (
        {
          code: e.coursecode,
          score: e.score,
          date: e.date,
        }));

      resolve(exams);
    });
  });
};