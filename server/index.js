import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import sql from './config/db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);

// Database Initialization
const initDatabase = async () => {
  try {
    // 1. Test Connection
    await sql`SELECT 1 + 1`;
    console.log('✅ Supabase Connected (Postgres.js)');

    // 2. Run Schema Init
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await sql.unsafe(schema);
      console.log('✅ Database Schema Verified/Initialized');
    }
  } catch (err) {
    console.error('❌ Database Initialization Error:', err.message);
  }
};

initDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
