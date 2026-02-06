import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateCourse() {
  const [url, setUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setCreating(true);
    try {
      const res = await axios.post('/api/create', { youtubeUrl: url });
      // after creation, go to edit view so the user can tweak JSON if they like
      navigate(`/edit/${res.data.id}`);
    } catch (err) {
      console.error('Create failed', err);
      alert('Failed to create course. See console for details.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h2>Create a New Course</h2>
      <form onSubmit={handleSubmit}>
        <label>YouTube URL:
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=..."
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <button type="submit" disabled={creating} style={{ marginTop: '1rem' }}>{creating ? 'Creating…' : 'Create'}</button>
      </form>
    </div>
  );
}

export default CreateCourse;
