import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface CourseInfo {
  id: string;
  title: string;
}

function CourseList() {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get<CourseInfo[]>('/api/courses');
        setCourses(res.data);
      } catch (e) {
        console.error('Failed to load courses', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  async function deleteCourse(id: string) {
    if (!window.confirm('Delete this course?')) return;
    await axios.delete(`/api/course/${id}`);
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  if (loading) return <p>Loading courses…</p>;

  return (
    <div>
      <h2>Your Courses</h2>
      {courses.length === 0 ? (
        <p>No courses yet. <Link to="/create">Create one</Link>.</p>
      ) : (
        <ul>
          {courses.map(c => (
            <li key={c.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{c.title}</strong> 
              <Link to={`/edit/${c.id}`} style={{ marginLeft: '1rem' }}>Edit</Link>
              <button onClick={() => deleteCourse(c.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;
