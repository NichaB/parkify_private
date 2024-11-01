// api/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let users = []; // Temporary storage

// Route to handle registration
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Store user data
  users.push({ email, password });
  res.status(200).json({ success: true, message: 'Registration successful' });
});

// Route to retrieve the last registered user
app.get('/register', (req, res) => {
  if (users.length === 0) {
    return res.status(404).json({ error: 'No users found' });
  }
  res.status(200).json(users[users.length - 1]); // Return the last registered user
});

// Start server on port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
