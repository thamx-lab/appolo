// ====================================================================
// ROLEX GYM - BACKEND SERVER
// This file runs our server. It handles incoming requests, communicates
// with our Supabase database, and returns the answers!
// ====================================================================

// 1. Load security secrets from our '.env' file
require('dotenv').config();

// 2. Import the packages we need
const express = require('express'); // Express helps us build REST API routes
const cors = require('cors'); // CORS allows our React frontend to talk to this backend
const { createClient } = require('@supabase/supabase-js'); // Supabase client connects us to the database

// 3. Create the Express App
const app = express();

// 4. Setup middleware (these are helpers that prepare data before we use it)
app.use(cors()); // Allow frontend websites to access our API
app.use(express.json()); // Allow our server to read JSON bodies sent in requests

// 5. Initialize Supabase Database Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// If we are missing our database keys, warn the server operator
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is missing from environment variables!");
}

const validUrl = (supabaseUrl && supabaseUrl.startsWith('http')) ? supabaseUrl : 'https://setup-your-supabase-url-in-render-settings.supabase.co';
const supabase = createClient(validUrl, supabaseAnonKey || 'dummy-key');

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Route A: Welcome Route (just to check if our server is alive and kicking!)
app.get('/', (req, res) => {
  res.json({
    message: "🏋️ Welcome to the Rolex Gym Premium API! We are online and ready.",
    version: "1.0.0",
    status: "healthy"
  });
});

// Route B: GET /api/plans
// Fetches all available gym membership packages from the database.
app.get('/api/plans', async (req, res) => {
  try {
    // Talk to Supabase: "Hey, select all columns from the plans table and order them by price!"
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;

    // Send the list of plans back to the frontend
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching plans:", err.message);
    res.status(500).json({
      success: false,
      message: "Could not fetch membership plans. Please try again later.",
      error: err.message
    });
  }
});

// Route C: POST /api/join
// Registers a new user into our 'members' table when they sign up for a plan.
app.post('/api/join', async (req, res) => {
  try {
    const { fullName, email, phone, planId } = req.body;

    // A. Validation: Make sure the user didn't leave any blanks!
    if (!fullName || !email || !phone || !planId) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields: fullName, email, phone, and planId."
      });
    }

    // B. Check if a member with this email is already signed up
    const { data: existingMember, error: findError } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (findError) throw findError;

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "This email address is already registered at Rolex Gym! Choose another or log in."
      });
    }

    // C. Insert the new member into our Supabase 'members' table
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          plan_id: planId,
          status: 'pending' // starts as pending, then our admins activate it manually!
        }
      ])
      .select();

    if (error) throw error;

    // D. Respond with success
    res.status(201).json({
      success: true,
      message: "🎉 Success! You have joined Rolex Gym. Our premium onboarding team will contact you shortly.",
      member: data[0]
    });

  } catch (err) {
    console.error("Error joining gym:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while trying to process your sign-up. Please try again.",
      error: err.message
    });
  }
});

// Route D: POST /api/contact
// Saves direct contact inquiries from our support form.
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // A. Validation: Check if everything is filled
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields: name, email, subject, and message."
      });
    }

    // B. Insert the contact message into our Supabase 'contacts' table
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        { name, email, subject, message }
      ])
      .select();

    if (error) throw error;

    // C. Respond with success
    res.status(201).json({
      success: true,
      message: "✉️ Message sent successfully! Our Rolex concierge team will reply in 24 hours.",
      contact: data[0]
    });

  } catch (err) {
    console.error("Error creating contact:", err.message);
    res.status(500).json({
      success: false,
      message: "We couldn't save your message right now. Please try again.",
      error: err.message
    });
  }
});

// ==========================================
// START THE SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ [server]: Rolex Gym API is running at http://localhost:${PORT}`);
});

// Export the app for Vercel Serverless hosting
module.exports = app;
