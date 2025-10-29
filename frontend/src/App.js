import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';

const API_URL = 'https://student-feedback-8oem.onrender.com/api/feedback'; // Backend endpoint

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');

      const data = await response.json();
      setFeedbacks(Array.isArray(data) ? data : []); // Ensure it's always an array
      setError(null);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Check if the backend server is running.');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleRefresh = () => fetchFeedbacks();

  return (
    <div className="App">
      <header className="app-header">
        <h1>Student Feedback System</h1>
      </header>

      <nav className="navigation">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'submit' ? 'active' : ''}
          onClick={() => setActiveTab('submit')}
        >
          Submit Feedback
        </button>
        <button
          className={activeTab === 'view' ? 'active' : ''}
          onClick={() => setActiveTab('view')}
        >
          View All Feedbacks
        </button>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard feedbacks={feedbacks} />}
            {activeTab === 'submit' && <FeedbackForm onSubmit={handleRefresh} />}
            {activeTab === 'view' && <FeedbackList feedbacks={feedbacks} onDelete={handleRefresh} />}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>JACINTA 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
