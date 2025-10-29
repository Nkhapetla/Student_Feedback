import React, { useEffect, useState } from 'react';

const Dashboard = ({ feedbacks }) => {
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0
  });

  useEffect(() => {
    const total = feedbacks.length;
    const avgRating = total > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
      : 0;

    setStats({ total, avgRating });
  }, [feedbacks]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Feedbacks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.avgRating}</h3>
          <p>Average Rating</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
