// ====================================================================
// BLACK SHEEP - BACKEND SERVER
// Handles API requests, connects to Supabase, enforces safety,
// and returns responses for the Black Sheep website.
// ====================================================================

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const crypto   = require('crypto');          // Built-in Node.js — for HMAC verification
const Razorpay = require('razorpay');        // Official Razorpay SDK
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ==========================================
// SECURITY HARDENING MIDDLEWARES
// ==========================================

// 1. Secure CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow local development and Render preview/production subdomains
    if (
      allowedOrigins.length === 0 || 
      allowedOrigins.indexOf(origin) !== -1 || 
      origin.includes('onrender.com') || 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy: Origin not authorized by Black Sheep Security.'));
  }
}));

app.use(express.json());

// 2. HTTP Security Headers (Helmet Equivalent)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    // FIX 3: Added frame-src for checkout iframe + img-src for card logos/bank icons
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; frame-src https://api.razorpay.com https://checkout.razorpay.com; connect-src 'self' https://api.razorpay.com; img-src 'self' https://checkout.razorpay.com data:;"
  );
  next();
});

// 3. Memory-based API Rate Limiter to prevent spam/abuse
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 40; // max 40 requests per IP per minute

const apiRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, []);
  }
  
  const timestamps = ipRequestCounts.get(ip).filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many transmission requests. Please standby and retry in 60 seconds."
    });
  }
  
  timestamps.push(now);
  ipRequestCounts.set(ip, timestamps);
  next();
};

app.use('/api/', apiRateLimiter);

// ==========================================
// DATABASE SETUP & KEY VALIDATION
// ==========================================

const supabaseUrl     = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is missing from environment variables!");
}

const validUrl = (supabaseUrl && supabaseUrl.startsWith('http')) ? supabaseUrl : 'https://setup-your-supabase-url-in-render-settings.supabase.co';
const supabase = createClient(validUrl, supabaseAnonKey || 'dummy-key');

// ==========================================
// RAZORPAY SETUP
// ==========================================

const razorpayKeyId     = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn("⚠️ WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing! Payments will not work.");
}

// Use placeholder values to prevent the app from crashing on startup
// if the environment variables are not set yet (e.g., local dev).
// Payments will fail, but the server will run.
const razorpay = new Razorpay({
  key_id:     razorpayKeyId     || 'rzp_test_dummy_key_id_to_prevent_crash',
  key_secret: razorpayKeySecret || 'dummy_secret'
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Route A: Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: "🏋️ Welcome to the Black Sheep Premium API! We are online and ready.",
    version: "1.0.0",
    status: "healthy"
  });
});

// Route B: Database Health Diagnostics (Task 1)
app.get('/api/db-diagnostics', async (req, res) => {
  try {
    const start = Date.now();
    
    // Test connectivity by querying plans
    const { data: plansData, error: plansError } = await supabase
      .from('plans')
      .select('id, name')
      .limit(1);
      
    if (plansError) throw plansError;
    
    const latency = Date.now() - start;
    
    // Check schemas of members and contacts
    const { error: membersError } = await supabase
      .from('members')
      .select('id')
      .limit(1);
      
    const { error: contactsError } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);
      
    const dbHealthy = !plansError && !membersError && !contactsError;
    
    res.status(200).json({
      success: true,
      status: "healthy",
      database: dbHealthy ? "connected" : "unhealthy",
      latencyMs: latency,
      tablesChecked: {
        plans: !plansError,
        members: !membersError,
        contacts: !contactsError
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route C: GET /api/plans
app.get('/api/plans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
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

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Allow numbers, spaces, dashes, parentheses and +
  const phoneRegex = /^[\d\s()+-]{7,20}$/;
  return phoneRegex.test(phone);
}

// Route D: POST /api/join
app.post('/api/join', async (req, res) => {
  try {
    const { fullName, email, phone, planId } = req.body;

    // 1. Validation Checks
    if (!fullName || !email || !phone || !planId) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields: fullName, email, phone, and planId."
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name (minimum 2 characters)."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number coordinate."
      });
    }

    // 2. Check if already registered
    const { data: existingMember, error: findError } = await supabase
      .from('members')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (findError) throw findError;

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "This email address is already registered at Black Sheep! Choose another or log in."
      });
    }

    // 3. Safe parameterized insert
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          plan_id: planId,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "🎉 Success! You have joined Black Sheep. Our premium onboarding team will contact you shortly.",
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

// Route E: POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validation Checks
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields: name, email, subject, and message."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (name.trim().length < 2 || subject.trim().length < 3 || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Input fields do not meet length safety constraints."
      });
    }

    // 2. Safe insertion
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        { 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          subject: subject.trim(), 
          message: message.trim() 
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "✉️ Message sent successfully! Our Black Sheep concierge team will reply in 24 hours.",
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

// ─────────────────────────────────────────────────────────────────────
// Route F-1: POST /api/payment/create-order
// Creates a Razorpay Order on the SERVER (secure — amount cannot be
// tampered with by the client because it is set here, not on frontend).
// ─────────────────────────────────────────────────────────────────────
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { planName, memberEmail } = req.body;

    if (!planName || !memberEmail) {
      return res.status(400).json({ success: false, message: 'planName and memberEmail are required.' });
    }

    if (!isValidEmail(memberEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // FIX 2: Authoritative price map — set on the SERVER, not trusted from client.
    // Prices are in paise (1 INR = 100 paise). Update these to match your actual plan prices.
    const PRICE_MAP = {
      silver:   60000,   // ₹600  — change to your actual Silver price × 100
      gold:     80000,   // ₹800  — change to your actual Gold price × 100
      platinum: 100000   // ₹1000 — change to your actual Platinum price × 100
    };

    const planKey = planName.toLowerCase().includes('silver') ? 'silver'
                  : planName.toLowerCase().includes('gold')   ? 'gold'
                  : 'platinum';

    const amountInPaise = PRICE_MAP[planKey];

    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
      notes: {
        plan_name: planName,
        member_email: memberEmail
      }
    });

    res.status(200).json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    razorpayKeyId   // Safe to expose — this is the public key
    });

  } catch (err) {
    console.error('Razorpay order creation error:', err.message);
    res.status(500).json({ success: false, message: 'Could not create payment order.', error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────
// Route F-2: POST /api/payment/verify
// Verifies Razorpay signature using HMAC-SHA256 on the SERVER.
// Only records payment AFTER the signature is confirmed valid.
// This prevents fake/spoofed payment confirmations.
// ─────────────────────────────────────────────────────────────────────
app.post('/api/payment/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      memberName,
      memberEmail,
      planName,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    // ✅ SECURITY: Verify the HMAC-SHA256 signature
    // Razorpay signs: order_id + "|" + payment_id with your KEY SECRET
    // If the signature doesn't match, the payment is FAKE — reject it.
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('⚠️ SECURITY ALERT: Signature mismatch! Possible payment tampering attempt.');
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // ✅ Signature verified — safe to record payment
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        member_name:    memberName   ? memberName.trim()                : 'Anonymous',
        member_email:   memberEmail  ? memberEmail.trim().toLowerCase() : '',
        plan_name:      planName     ? planName.trim()                  : 'Unknown Plan',
        amount:         parseFloat(amount) / 100, // convert paise back to INR
        currency:       'INR',
        transaction_id: razorpay_payment_id,
        order_id:       razorpay_order_id,
        status:         'completed'
      }])
      .select();

    if (error) {
      console.warn('Payment DB log failed (run schema.sql in Supabase):', error.message);
    }

    res.status(200).json({
      success: true,
      message: '✅ Payment verified and recorded successfully!',
      paymentId: razorpay_payment_id
    });

  } catch (err) {
    console.error('Payment verification error:', err.message);
    res.status(500).json({ success: false, message: 'Payment verification failed.', error: err.message });
  }
});

// ==========================================
// START THE SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ [server]: Black Sheep API is running at http://localhost:${PORT}`);
});

module.exports = app;