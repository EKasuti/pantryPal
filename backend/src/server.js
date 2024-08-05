console.log('Starting server.js');

const express = require('express');
const cors = require('cors');
const { addEmailToWaitlist, getAllWaitlistEntries, createUser, loginUser, createPantry, addItemToPantry, getPantriesForUser, getPantryByNameAndUser, getItemsForPantry, deletePantry, updateItemQuantity, deleteItemFromPantry, updateItemDetails } = require('./firebase/services');
const admin = require('firebase-admin');

require('dotenv').config();

const app = express();

// Improved CORS configuration
const allowedOrigins = ['https://pantry-pal-sooty.vercel.app', 'http://localhost:8000', 'http://localhost:3000'];
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

// Firebase connection test route
app.get('/test-firebase', async (req, res) => {
  try {
    const testDoc = await db.collection('test').doc('test').set({ test: 'data' });
    res.json({ message: 'Firebase connection successful', docId: testDoc.id });
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({ message: 'Firebase connection failed', error: error.message });
  }
});

// POST route for user signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Attempting to create user:', email);
    const result = await createUser(email, password);
    if (result.success) {
      res.status(201).json({ message: 'User created successfully', uid: result.uid });
    } else {
      console.error('Failed to create user:', result.error);
      res.status(400).json({ message: 'Failed to create user', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// POST route for user login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await loginUser(email, password);
    if (result.success) {
      res.status(200).json({ 
        message: 'Login successful', 
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json({ message: 'Login failed', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Middleware to verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    console.log('Attempting to verify token:', idToken.substring(0, 10) + '...');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verified successfully. User ID:', decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// POST route to create a pantry
app.post('/api/pantry/add', authenticateUser, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.uid;

  if (!name) {
    return res.status(400).json({ message: 'Pantry name is required' });
  }

  try {
    const result = await createPantry(userId, name);
    if (result.success) {
      res.status(201).json({
        message: 'Pantry created successfully',
        pantry: result.pantry
      });
    } else {
      res.status(400).json({ message: 'Failed to create pantry', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// POST route to add an item to a pantry
app.post('/api/pantry/:pantryId/item', authenticateUser, async (req, res) => {
  const { pantryId } = req.params;
  const { name, category, quantity, purchaseDate, expiryDate } = req.body;

  if (!name || !category || !quantity) {
    return res.status(400).json({ message: 'Name, category, and quantity are required' });
  }

  try {
    const result = await addItemToPantry(pantryId, { name, category, quantity, purchaseDate, expiryDate });
    if (result.success) {
      res.status(201).json({
        message: 'Item added to pantry successfully',
        item: result.item
      });
    } else {
      res.status(400).json({ message: 'Failed to add item to pantry', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// DELETE route to delete a pantry
app.delete('/api/pantry/:pantryId', authenticateUser, async (req, res) => {
  const userId = req.user.uid;
  const { pantryId } = req.params;

  try {
    const result = await deletePantry(userId, pantryId);
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: 'Failed to delete pantry', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// DELETE route to remove an item from a pantry
app.delete('/api/pantry/:pantryId/item/:itemId', authenticateUser, async (req, res) => {
  const userId = req.user.uid;
  const { pantryId, itemId } = req.params;

  try {
    // Check if the pantry exists and belongs to the user
    const pantry = await getPantryByNameAndUser(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found or access denied' });
    }

    const result = await deleteItemFromPantry(pantryId, itemId);
    if (result.success) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete item', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.toString() });
});

// GET route for user profile
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    // req.user should be set by the authenticateUser middleware
    const userId = req.user.uid;
    
    // For testing, you can just send back a dummy user object
    const userData = {
      id: userId,
      name: 'Test User',
      email: 'testuser@example.com'
    };
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.toString() });
  }
});

// GET route to retrieve pantry list for a user
app.get('/api/pantry/list', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const pantries = await getPantriesForUser(userId);
    res.status(200).json(pantries);
  } catch (error) {
    console.error('Error fetching pantry list:', error);
    res.status(500).json({ message: 'Error fetching pantry list', error: error.toString() });
  }
});

// GET route to retrieve items for a specific pantry
app.get('/api/pantry/:pantryId/items', authenticateUser, async (req, res) => {
  try {
    const pantryId = req.params.pantryId;
    const userId = req.user.uid;
    console.log(`Attempting to fetch items for pantry ${pantryId} for user ${userId}`);

    // Check if the pantry exists and belongs to the user
    const pantry = await getPantryByNameAndUser(pantryId, userId);
    if (!pantry) {
      console.log(`Pantry ${pantryId} not found or does not belong to user ${userId}`);
      return res.status(404).json({ message: 'Pantry not found or access denied' });
    }

    // Fetch items for the pantry
    const items = await getItemsForPantry(pantryId);
    console.log(`Found ${items.length} items for pantry ${pantryId}`);

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// PATCH route to update item quantity
app.patch('/api/pantry/:pantryId/item/:itemId', authenticateUser, async (req, res) => {
  const { pantryId, itemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  try {
    const result = await updateItemQuantity(pantryId, itemId, quantity);
    if (result.success) {
      res.status(200).json({
        message: 'Item quantity updated successfully',
        item: result.item
      });
    } else {
      res.status(400).json({ message: 'Failed to update item quantity', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// PUT route to update item details
app.put('/api/pantry/:pantryId/item/:itemId', authenticateUser, async (req, res) => {
  const { pantryId, itemId } = req.params;
  const { name, category, quantity, purchaseDate, expiryDate } = req.body;
  const userId = req.user.uid;

  if (!name || !category || quantity === undefined) {
    return res.status(400).json({ message: 'Name, category, and quantity are required' });
  }

  try {
    // Check if the pantry exists and belongs to the user
    const pantry = await getPantryByNameAndUser(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found or access denied' });
    }

    const result = await updateItemDetails(pantryId, itemId, { name, category, quantity, purchaseDate, expiryDate });
    if (result.success) {
      res.status(200).json({
        message: 'Item updated successfully',
        item: result.item
      });
    } else {
      res.status(400).json({ message: 'Failed to update item', error: result.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = app;
// Add these lines at the end of the file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});