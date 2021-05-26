import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Alert } from 'react-bootstrap';
import { ExamScores } from './ExamComponents.js';
import AppTitle from './AppTitle.js';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import API from './API';

function App() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(()=> {
    const getCourses = async () => {
        const courses = await API.getAllCourses();
        setCourses(courses);
    };
    getCourses()
      .catch(err => {
        setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, []);

  useEffect(()=> {
    const getExams = async () => {
      const exams = await API.getAllExams();
      setExams(exams);
    };
    if(courses.length) {
      getExams().catch(err => {
        setMessage({msg: 'Impossible to load your exams! Please, try again later...', type: 'danger'});
        console.error(err);
      });
    }
  }, [courses.length]);

  return (<Router>
    <Container className="App">
      <Row>
        <AppTitle/>
      </Row>
      {message && <Row>
         <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> }

      <Switch>
        <Route path="/" render={() =>
          <Row>
            <ExamScores exams={exams} courses={courses} />
          </Row>
        } />
        
      </Switch>
    </Container>
  </Router>);
}

export default App;
