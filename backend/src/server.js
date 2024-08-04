console.log('Starting server.js');

const express = require('express');
const cors = require('cors');
const { addEmailToWaitlist, getAllWaitlistEntries, signUpUser, loginUser } = require('./firebase/services');

require('dotenv').config();

const app = express();

// Improved CORS configuration
const allowedOrigins = ['https://pantry-pal-sooty.vercel.app', 'http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  next();
});

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the PantryPal API');
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Firebase connection test route
app.get('/test-firebase', async (req, res) => {
  try {
    const db = require('./firebase/config').db;
    await db.collection('test').doc('test').set({ test: 'test' });
    res.status(200).json({ message: 'Firebase connection successful' });
  } catch (error) {
    res.status(500).json({ message: 'Firebase connection failed', error: error.message });
  }
});

// POST route to add an email to the waitlist
app.post('/api/waitlist/join', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
   
    const result = await addEmailToWaitlist(email);
    console.log('Result from addEmailToWaitlist:', result);
    if (result.success) {
      res.status(200).json({ message: 'Email added to waitlist successfully', id: result.id });
    } else if (result.error === 'Email already exists in the waitlist') {
      res.status(409).json({ message: 'Email already exists in the waitlist' });
    } else {
      console.error('Failed to add email:', result.error);
      res.status(500).json({ message: 'Failed to add email to waitlist', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// GET route to retrieve all waitlist entries 
app.get('/api/waitlist/list', async (req, res) => {
  try {
    const waitlist = await getAllWaitlistEntries();
    res.status(200).json(waitlist);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ message: 'Error fetching waitlist', error: error.message });
  }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  try {
    const result = await signUpUser(email, password, name);
    if (result.success) {
      res.status(201).json({ message: 'User created successfully', userId: result.userId });
    } else {
      res.status(400).json({ message: 'Signup failed', error: result.error });
    }
  } catch (error) {
    console.error('Server error during signup:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await loginUser(email, password);
    if (result.success) {
      res.status(200).json({ message: 'Login successful', userId: result.userId, token: result.token });
    } else {
      res.status(401).json({ message: 'Login failed', error: result.error });
    }
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Add a catch-all error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;