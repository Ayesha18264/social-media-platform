const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config(); // For environment variables

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: '3D*d#j^X!kP&5zq8@A$1T&8mL%9F', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/social-media';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(`Error connecting to MongoDB: ${err.message}`));

// Example Mongoose Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Platform API');
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    req.session.userId = user._id; // Store user session
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected Route (Example)
app.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await User.findById(req.session.userId);
  res.json(user);
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
