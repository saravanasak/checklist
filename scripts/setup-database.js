/**
 * Supabase Database Setup Script
 * 
 * This script creates the necessary tables and policies for the Employee Checklist application.
 * Run this script with your Supabase credentials to set up your database.
 * 
 * Usage:
 * node setup-database.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and Anon Key must be provided in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database for Employee Checklist application...');

  try {
    // Create checklist_submissions table
    const { error: createTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'checklist_submissions',
      definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_name TEXT NOT NULL,
        employee_id TEXT NOT NULL,
        department TEXT NOT NULL,
        start_date DATE NOT NULL,
        submission_date DATE NOT NULL,
        signature TEXT NOT NULL,
        signature_date DATE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('complete', 'incomplete', 'pending')),
        completion_percentage INTEGER NOT NULL,
        q1 TEXT NOT NULL CHECK (q1 IN ('Yes', 'No')),
        q2 TEXT NOT NULL CHECK (q2 IN ('Yes', 'No')),
        q3 TEXT NOT NULL CHECK (q3 IN ('Yes', 'No')),
        q4 TEXT NOT NULL CHECK (q4 IN ('Yes', 'No')),
        q5 TEXT NOT NULL CHECK (q5 IN ('Yes', 'No')),
        q6 TEXT[] NOT NULL,
        q7 TEXT NOT NULL CHECK (q7 IN ('Yes', 'No')),
        q8 TEXT NOT NULL CHECK (q8 IN ('Yes', 'No')),
        q9 TEXT NOT NULL CHECK (q9 IN ('Yes', 'No')),
        q10 TEXT NOT NULL CHECK (q10 IN ('Yes', 'No', 'Choose not to use personal device for work purposes')),
        q11 TEXT NOT NULL CHECK (q11 IN ('Yes', 'No')),
        q12 TEXT NOT NULL CHECK (q12 IN ('Yes', 'No')),
        comments TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      `
    });

    if (createTableError) {
      console.error('Error creating checklist_submissions table:', createTableError);
      return;
    }

    console.log('✅ checklist_submissions table created successfully');

    // Create updated_at trigger function
    const { error: triggerFunctionError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (triggerFunctionError) {
      console.error('Error creating updated_at trigger function:', triggerFunctionError);
      return;
    }

    console.log('✅ updated_at trigger function created successfully');

    // Create trigger on checklist_submissions table
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP TRIGGER IF EXISTS update_checklist_submissions_updated_at ON checklist_submissions;
        CREATE TRIGGER update_checklist_submissions_updated_at
        BEFORE UPDATE ON checklist_submissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (triggerError) {
      console.error('Error creating trigger on checklist_submissions table:', triggerError);
      return;
    }

    console.log('✅ update_updated_at trigger created successfully');

    // Create RLS policies
    const { error: rlsPolicyError } = await supabase.rpc('execute_sql', {
      sql: `
        -- Enable RLS on the table
        ALTER TABLE checklist_submissions ENABLE ROW LEVEL SECURITY;

        -- Create policy for anonymous access (for demo purposes)
        CREATE POLICY "Allow anonymous access" ON checklist_submissions
        FOR ALL USING (true);
      `
    });

    if (rlsPolicyError) {
      console.error('Error creating RLS policies:', rlsPolicyError);
      return;
    }

    console.log('✅ RLS policies created successfully');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run the application with: npm run dev');
    console.log('2. Access the employee form at: http://localhost:3000');
    console.log('3. Access the admin dashboard at: http://localhost:3000/admin');

  } catch (error) {
    console.error('Unexpected error during database setup:', error);
  }
}

setupDatabase();
