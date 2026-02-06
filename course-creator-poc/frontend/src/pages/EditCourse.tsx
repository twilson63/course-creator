import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';

function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [json, setJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`/api/course/${id}`);
        setJson(JSON.stringify(res.data, null, 2));
      } catch (e) {
        console.error('Failed to load course', e);
        alert('Could not load course');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, navigate]);

  async function handleSave() {
    setSaving(true);
    try {
      const parsed = JSON.parse(json);
      await axios.put(`/api/course/${id}`, parsed);
      alert('Saved!');
    } catch (e) {
      console.error('Save failed', e);
      alert('Save failed – check console');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading course…</p>;

  return (
    <div>
      <h2>Edit Course – {id}</h2>
      <MonacoEditor
        height="60vh"
        defaultLanguage="json"
        value={json}
        onChange={(val) => setJson(val || '')}
        options={{ minimap: { enabled: false } }}
      />
      <button onClick={handleSave} disabled={saving} style={{ marginTop: '1rem' }}>
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}

export default EditCourse;
