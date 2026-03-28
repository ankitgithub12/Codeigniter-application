import sql from './config/db.js';

const fixDatabase = async () => {
  try {
    console.log('🔄 Altering auth_user.reset_token_expiry column type to TIMESTAMPTZ...');
    await sql`ALTER TABLE auth_user ALTER COLUMN reset_token_expiry TYPE TIMESTAMP WITH TIME ZONE;`;
    console.log('✅ Column type updated successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating column type:', err.message);
    process.exit(1);
  }
};

fixDatabase();
