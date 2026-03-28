import express from 'express';
import sql from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Fetch all teachers with user details
router.get('/', async (req, res) => {
  try {
    const teachers = await sql`
      SELECT t.*, u.first_name, u.last_name, u.email
      FROM teachers t
      JOIN auth_user u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    
    // Format response to match the frontend expectations
    const formatted = teachers.map(t => ({
      ...t,
      User: {
        first_name: t.first_name,
        last_name: t.last_name,
        email: t.email
      }
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ error: 'Repository access failure' });
  }
});

// Single POST Registration (User + Teacher)
router.post('/register-teacher', async (req, res) => {
  const { email, password, first_name, last_name, university_name, gender, year_joined } = req.body;
  
  try {
    // Transaction-like approach with postgres.js
    await sql.begin(async (sql) => {
      // 1. Create User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const [user] = await sql`
        INSERT INTO auth_user (email, password, first_name, last_name)
        VALUES (${email}, ${hashedPassword}, ${first_name}, ${last_name})
        RETURNING id
      `;
      
      // 2. Create Teacher linked to User
      await sql`
        INSERT INTO teachers (user_id, university_name, gender, year_joined)
        VALUES (${user.id}, ${university_name}, ${gender}, ${year_joined})
      `;
    });

    res.status(201).json({ message: 'Teacher profile deployed successfully' });
  } catch (err) {
    console.error('Teacher registration error:', err);
    res.status(500).json({ error: 'Unified registration sequence failure' });
  }
});

export default router;
