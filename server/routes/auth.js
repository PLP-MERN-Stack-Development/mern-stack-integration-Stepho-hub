const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register attempt:', { name, email, password: password ? 'provided' : 'missing' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.log('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login route hit with body:', { email: req.body.email, password: req.body.password ? '[HIDDEN]' : 'missing' });
  try {
    const { email, password } = req.body;
    console.log('Processing login for email:', email);
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? `Found user ${user._id}` : 'No user found');
    if (!user) {
      console.log('Authentication failed: user not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Authentication failed: invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('Generating JWT token...');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('Login successful for user:', email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
