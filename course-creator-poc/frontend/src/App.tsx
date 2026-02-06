import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseList from './pages/CourseList';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/create">Create New Course</Link>
      </nav>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/create" element={<CreateCourse />} />
          <Route path="/edit/:id" element={<EditCourse />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
