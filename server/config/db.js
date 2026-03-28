import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()

// Clean the connection string to prevent ERR_INVALID_URL if the key name is somehow included
let connectionString = process.env.DATABASE_URL || '';

// Debugging: Mask password for safety
if (connectionString) {
  const masked = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log('DEBUG: Connecting to Supabase with URL:', masked);
} else {
  console.log('DEBUG: DATABASE_URL is EMPTY!');
}

if (connectionString.startsWith('DATABASE_URL=')) {
  connectionString = connectionString.replace('DATABASE_URL=', '');
}

const sql = postgres(connectionString, {
  ssl: 'require', 
})

export default sql
