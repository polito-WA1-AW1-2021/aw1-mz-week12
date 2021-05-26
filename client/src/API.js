/**
 * All the API calls
 */
import Course from './models/Course';
import Exam from './models/Exam';

const BASEURL = '/api';

async function getAllCourses() {
  // call: GET /api/courses
  const response = await fetch(BASEURL + '/courses');
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((co) => Course.from(co));
  } else {
    throw coursesJson;  // an object with the error coming from the server
  }
}

async function getAllExams() {
  // call: GET /api/exams
  const response = await fetch(BASEURL + '/exams');
  const examsJson = await response.json();
  if (response.ok) {
    return examsJson.map((ex) => Exam.from(ex));
  } else {
    throw examsJson;  // an object with the error coming from the server
  }
}

const API = {getAllCourses, getAllExams};
export default API;