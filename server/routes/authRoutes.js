import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import sql from '../config/db.js';

dotenv.config();

const router = express.Router();

// Safety check for SendGrid API Key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey && apiKey.startsWith('SG.')) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn('⚠️ SendGrid API Key is missing or invalid. Email features will be disabled.');
}

// User Registration
router.post('/register', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    // Check if user exists
    const [existing] = await sql`SELECT id FROM auth_user WHERE email = ${email}`;
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [user] = await sql`
      INSERT INTO auth_user (email, password, first_name, last_name)
      VALUES (${email}, ${hashedPassword}, ${first_name}, ${last_name})
      RETURNING id, email, first_name, last_name
    `;

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Database enrollment failure' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await sql`SELECT * FROM auth_user WHERE email = ${email}`;
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Remove password from response
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Authentication process failure' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [user] = await sql`SELECT id FROM auth_user WHERE email = ${email}`;
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const expiry = new Date(Date.now() + 15 * 60 * 1000); 

    await sql`
      UPDATE auth_user 
      SET reset_token = ${resetToken}, reset_token_expiry = ${expiry} 
      WHERE id = ${user.id}
    `;

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const htmlContent = `
      <div style="background-color: #020617; padding: 60px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #94a3b8; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%); padding: 40px; text-align: center;">
            <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 20px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; font-style: italic;">Edu<span style="color: #22d3ee;">Flux</span></h1>
            <p style="color: rgba(199, 210, 254, 0.6); margin-top: 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4em;">Command Node v4.0</p>
          </div>

          <!-- Body -->
          <div style="padding: 50px 40px; text-align: center;">
            <div style="display: inline-block; padding: 8px 16px; background-color: rgba(79, 70, 229, 0.1); border: 1px solid rgba(79, 70, 229, 0.2); border-radius: 10px; margin-bottom: 30px;">
              <span style="color: #6366f1; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em;">Identity Recovery Protocol</span>
            </div>
            <h2 style="color: white; font-size: 32px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.02em;">ACCESS <span style="color: #6366f1;">OVERRIDE</span> REQUESTED</h2>
            <p style="font-size: 14px; margin-bottom: 40px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">A security node has requested an identity restoration for this terminal. If you initiated this sequence, authorize the override below.</p>
            
            <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 20px 40px; border-radius: 20px; font-size: 11px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 0.4em; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);">
              Authorize Reset Protocol
            </a>
            
            <div style="margin-top: 50px; padding-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="font-size: 9px; color: #475569; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em;">Temporal link expires in 15 minutes</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: rgba(255, 255, 255, 0.02); padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-size: 10px; color: #475569; font-weight: 700;">If you did not request this, please ignore this broadcast. Security integrity remains intact.</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 9px; color: #334155; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4em;">System Generated Node // EduFlux Network</p>
        </div>
      </div>
    `;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'EduFlux Protocol | Identity Recovery Request',
      text: `Authorize Access Override: ${resetUrl}`,
      html: htmlContent
    };

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      await sgMail.send(msg);
      res.json({ message: 'Recovery protocol initiated. Check your inbox.' });
    } else {
      res.status(503).json({ message: 'Email service inactive. Reset URL (Dev Mode): ' + resetUrl });
    }
  } catch (err) {
    console.error('Recovery error:', err);
  }
});

// Reset Password Protocol
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    // 1. Verify JWT integrity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Efficient lookup by ID
    const [user] = await sql`
      SELECT id, reset_token, reset_token_expiry FROM auth_user 
      WHERE id = ${decoded.id}
    `;

    // 3. Robust token comparison in memory to avoid encoding issues
    if (!user || user.reset_token !== token) {
      return res.status(401).json({ message: 'Individual node recovery link invalid or expired' });
    }

    // 4. Temporal check
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(401).json({ message: 'Recovery node temporal clearance expired' });
    }

    // 5. Atomic Update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql`
      UPDATE auth_user 
      SET password = ${hashedPassword}, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = ${user.id}
    `;

    res.json({ message: 'Identity override successful. Node security updated.' });
  } catch (err) {
    console.error('Reset Protocol Failure:', err);
    res.status(401).json({ message: 'Identity restoration sequence failed' });
  }
});

// Fetch all auth nodes (Registry View)
router.get('/users', async (req, res) => {
  try {
    const users = await sql`SELECT id, email, first_name, last_name, created_at FROM auth_user ORDER BY created_at DESC`;
    res.json(users);
  } catch (err) {
    console.error('Registry fetch error:', err);
    res.status(500).json({ error: 'Identity registry access failure' });
  }
});

// System Broadcast Sequence
router.post('/broadcast', async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject: `EduFlux Service Update | ${subject}`,
      text: message,
      html: `
        <div style="background-color: #020617; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; color: #94a3b8;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">Edu<span style="color: #22d3ee;">Flux</span> BROADCAST</h1>
            </div>
            <div style="padding: 40px; text-align: left;">
              <h2 style="color: white; font-size: 20px; font-weight: 900; margin-bottom: 20px;">INCOMING <span style="color: #6366f1;">SIGNAL</span></h2>
              <p style="font-size: 14px; line-height: 1.8; color: #94a3b8;">${message}</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                <p style="font-size: 9px; color: #475569; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em;">Authentication Token Verified // System Dispatch</p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      await sgMail.send(msg);
      res.json({ message: 'Broadcast transmitted successfully' });
    } else {
      res.status(503).json({ message: 'Email service inactive. Log: ' + message });
    }
  } catch (err) {
    console.error('Broadcast failure:', err);
    res.status(500).json({ error: 'Signal transmission failure' });
  }
});

export default router;
