const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled backend error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
};

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Student feedback API is running!' });
});

// GET - Retrieve all feedback
app.get('/api/feedback', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('createdat', { ascending: false }); // lowercase column

    if (error) {
      console.error('Supabase GET all feedback error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Fetched feedback data:', data);
    res.json(data);
  } catch (err) {
    console.error('Backend GET all feedback error:', err.message);
    next(err);
  }
});

// GET - Retrieve single feedback by ID
app.get('/api/feedback/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('Supabase GET single feedback error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'feedback not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Backend GET single feedback error:', err.message);
    next(err);
  }
});

// POST - Add new feedback
app.post('/api/feedback', async (req, res, next) => {
  try {
    const { studentName, courseCode, comments, rating } = req.body;

    // Validation
    if (!studentName || !courseCode || !comments || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Map variables to lowercase column names
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        studentname: studentName,
        coursecode: courseCode,
        comments,
        rating
      }])
      .select();

    if (error) {
      console.error('Supabase POST feedback error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Added feedback:', data[0]);
    res.status(201).json({ message: 'Feedback added successfully', data: data[0] });
  } catch (err) {
    console.error('Backend POST feedback error:', err.message);
    next(err);
  }
});

// DELETE - Remove feedback
app.delete('/api/feedback/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase DELETE feedback error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Deleted feedback id:', req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('Backend DELETE feedback error:', err.message);
    next(err);
  }
});

// Use error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Supabase connected!`);
});
