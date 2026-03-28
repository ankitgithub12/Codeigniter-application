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
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [user] = await sql`
      INSERT INTO users (email, password, first_name, last_name)
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
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
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
    const [user] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const expiry = new Date(Date.now() + 15 * 60 * 1000); 

    await sql`
      UPDATE users 
      SET reset_token = ${resetToken}, reset_token_expiry = ${expiry} 
      WHERE id = ${user.id}
    `;

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'EduPortal | Recovery Access Request',
      text: `Access Link: ${resetUrl}`,
      html: `<strong>Click to recover your account:</strong> <a href="${resetUrl}">${resetUrl}</a>`
    };

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      await sgMail.send(msg);
      res.json({ message: 'Recovery protocol initiated. Check your inbox.' });
    } else {
      res.status(503).json({ message: 'Email service inactive. Reset URL (Dev Mode): ' + resetUrl });
    }
  } catch (err) {
    console.error('Recovery error:', err);
    res.status(500).json({ message: 'Internal Server Error during recovery' });
  }
});

export default router;
