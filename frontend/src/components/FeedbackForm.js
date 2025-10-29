import React, { useState } from 'react';

const FeedbackForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 0
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';

    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    } else {
      const wordCount = formData.comments.trim().split(/\s+/).length;
      if (wordCount < 3) newErrors.comments = 'Comments must be at least 3 words';
    }

    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Please select a rating between 1 and 5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(' Feedback submitted successfully!');
        setFormData({ studentName: '', courseCode: '', comments: '', rating: 0 });
        setErrors({});

        if (onSubmit) onSubmit();

        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage(`❌ Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      setSubmitMessage('❌ Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>

      {submitMessage && (
        <div className={`message ${submitMessage.includes('❌') ? 'error' : 'success'}`}>
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name *</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your name"
            className={errors.studentName ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.studentName && <span className="error-text">{errors.studentName}</span>}
        </div>

        <div className="form-group">
          <label>Course Code *</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
            className={errors.courseCode ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.courseCode && <span className="error-text">{errors.courseCode}</span>}
        </div>

        <div className="form-group">
          <label>Comments * (at least 3 words)</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Share your feedback"
            rows="4"
            className={errors.comments ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.comments && <span className="error-text">{errors.comments}</span>}
        </div>

        <div className="form-group">
          <label>Rating (1-5) *</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.rating ? 'error-input' : ''}
          >
            <option value={0}>--Select Rating--</option>
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐⭐</option>
            <option value={3}>3 ⭐⭐⭐</option>
            <option value={4}>4 ⭐⭐⭐⭐</option>
            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          </select>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? ' Submitting...' : ' Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
