// server.js

require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- App Setup ---
const app = express();
const PORT = process.env.PORT || 5500;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const connectToMongo = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI not set in .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(connectToMongo, 5000); // Retry after 5 seconds
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected! Retrying...');
  connectToMongo();
});

connectToMongo();

// --- Contact Schema & Model ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email_address: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// --- API Route: POST /api/contact ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email_address, phone, message } = req.body;

    if (!name || !email_address || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const newContact = new Contact({ name, email_address, phone, message });
    await newContact.save();

    console.log('📨 New contact saved:', newContact);
    return res.status(201).json({ message: 'Thank you for contacting me!' });

  } catch (error) {
    console.error('❌ Error in /api/contact:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
