import React from 'react';

const FeedbackList = ({ feedbacks, onDelete }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onDelete();
        } else {
          alert('Error deleting feedback');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="feedback-list">
      <h2>All Feedback ({feedbacks.length})</h2>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback submitted yet. Be the first!</p>
      ) : (
        <div className="feedback-items">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <div>
                  <h3>{feedback.studentname}</h3>
                  <span className="course-code">{feedback.coursecode}</span>
                </div>
                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="delete-btn"
                  title="Delete feedback"
                >
                   Delete
                </button>
              </div>
              <p className="feedback-comments">{feedback.comments}</p>
              <div className="feedback-footer">
                <span className="rating">
                  Rating: {'⭐'.repeat(feedback.rating)} ({feedback.rating}/5)
                </span>
                <span className="date">
                  {formatDate(feedback.createdat)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
