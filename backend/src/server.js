const express = require('express');
const cors = require('cors');
const { addEmailToWaitlist, getAllWaitlistEntries } = require('./firebase/services');

require('dotenv').config();
console.log('Environment variables loaded');

const app = express();
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the PantryPal API');
});

// POST route to add an email to the waitlist
app.post('/api/waitlist/join', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await addEmailToWaitlist(email);
    if (result.success) {
      res.status(200).json({ message: 'Email added to waitlist successfully', id: result.id });
    } else if (result.error === 'Email already exists in the waitlist') {
      res.status(409).json({ message: 'Email already exists in the waitlist' });
    } else {
      res.status(500).json({ message: 'Failed to add email to waitlist', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to retrieve all waitlist entries (for admin purposes)
app.get('/api/waitlist/list', async (req, res) => {
  try {
    const waitlist = await getAllWaitlistEntries();
    res.status(200).json(waitlist);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ message: 'Error fetching waitlist', error: error.message });
  }
});


const PORT = process.env.PORT || 8000;

// Server start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});