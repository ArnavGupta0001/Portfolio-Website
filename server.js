// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 5500;

// --- MongoDB Atlas URI ---
// Replace <username>, <password> and <cluster> with your actual values
const mongoURI = 'mongodb+srv://arnavgupta98171:DPwhJNkS9YJbNWwg@arnav220.5cnekut.mongodb.net/';

// --- Middleware ---
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// --- MongoDB Connection ---
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

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

    // Validate input
    if (!name || !email_address || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // Save to MongoDB
    const newContact = new Contact({ name, email_address, phone, message });
    await newContact.save();

    console.log('📨 New Contact Submission:', newContact);
    return res.status(201).json({ message: 'Thank you for contacting me!' });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
